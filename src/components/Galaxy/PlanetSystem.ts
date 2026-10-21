import * as THREE from "three";
import type { PlanetConfig, ProjectCategory } from "../../data/projects";
import type { PlanetOnScreen } from "./planetBus";

/**
 * Cuerpos que orbitan a Gargantúa, uno por proyecto:
 * - Proyectos actuales → planetas: esferas con bandas de gas, en el plano del disco y con órbita sólida.
 * - Proyectos personales → satélites artificiales: cuerpo metálico y paneles solares, girando sobre sí
 *   mismos, en órbitas inclinadas y punteadas. Se distinguen de un vistazo.
 * Todo se ilumina desde el agujero negro (el disco de acreción es la fuente de luz).
 * Cuando uno está "fijado" (holograma abierto), todas las órbitas se detienen.
 */

const bodyVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vLocal;
  void main() {
    vLocal = position;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const planetFragment = /* glsl */ `
  uniform vec3 uLight;
  uniform vec3 uDark;
  uniform float uSelected;
  uniform float uSeed;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vLocal;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 toHole = normalize(-vWorld);                 // la luz viene del disco, en el centro
    vec3 toCam = normalize(cameraPosition - vWorld);

    float diffuse = max(dot(n, toHole), 0.0);
    float rim = pow(1.0 - max(dot(n, toCam), 0.0), 2.4);

    // Bandas de gas, como un gigante gaseoso
    float bands = 0.82 + 0.18 * sin(vLocal.y * 22.0 + sin(vLocal.x * 7.0 + uSeed) * 1.5);

    vec3 base = mix(uDark * 0.25, uLight, diffuse) * bands;
    vec3 warm = vec3(1.0, 0.72, 0.42) * diffuse * 0.25;  // reflejo cálido del disco
    vec3 atmosphere = uLight * rim * (0.55 + uSelected * 0.9);
    gl_FragColor = vec4(base + warm + atmosphere, 1.0);
  }
`;

/** Casco metálico del satélite: brillo especular del disco y borde resaltado al fijarlo */
const hullFragment = /* glsl */ `
  uniform vec3 uLight;
  uniform vec3 uDark;
  uniform float uSelected;
  varying vec3 vNormal;
  varying vec3 vWorld;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 toHole = normalize(-vWorld);
    vec3 toCam = normalize(cameraPosition - vWorld);
    float diffuse = max(dot(n, toHole), 0.0);
    float spec = pow(max(dot(reflect(-toHole, n), toCam), 0.0), 18.0);
    float rim = pow(1.0 - max(dot(n, toCam), 0.0), 2.0);
    vec3 col = mix(uDark * 0.35, uLight, 0.25 + diffuse * 0.75) + vec3(1.0, 0.85, 0.6) * spec * 0.9;
    col += uLight * rim * (0.25 + uSelected * 0.9);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Paneles solares: celdas azul noche con grilla dorada */
const panelFragment = /* glsl */ `
  uniform float uSelected;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vLocal;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 toHole = normalize(-vWorld);
    float diffuse = abs(dot(n, toHole));
    vec2 cell = fract(vec2(vLocal.x * 5.0, vLocal.y * 2.0));
    float line = step(0.9, max(cell.x, cell.y));
    vec3 panel = mix(vec3(0.07, 0.11, 0.26), vec3(0.18, 0.28, 0.6), diffuse);
    vec3 col = mix(panel, vec3(0.83, 0.66, 0.35), line * 0.8);
    col += vec3(0.83, 0.66, 0.35) * uSelected * 0.25;
    gl_FragColor = vec4(col, 1.0);
  }
`;

type Body = {
  key: string;
  cfg: PlanetConfig;
  kind: ProjectCategory;
  object: THREE.Object3D;
  mats: THREE.ShaderMaterial[];
  angle: number;
  speed: number;
  /** Radio para el área clickeable (los satélites se extienden con los paneles) */
  hitScale: number;
};

// Todos "transparentes" sólo para entrar en la misma pasada que el agujero negro:
// así renderOrder decide si el cuerpo queda delante o detrás de la sombra
const shaderMat = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>, side: THREE.Side = THREE.FrontSide) =>
  new THREE.ShaderMaterial({ vertexShader: bodyVertex, fragmentShader, uniforms, transparent: true, depthWrite: true, side });

export class PlanetSystem {
  readonly group = new THREE.Group();
  private bodies: Body[] = [];
  private orbits: THREE.Line[] = [];
  private orbitMat = new THREE.LineBasicMaterial({ color: "#D4A85A", transparent: true, opacity: 0, depthWrite: false });
  private dashedMat = new THREE.LineDashedMaterial({
    color: "#A9BFFF",
    transparent: true,
    opacity: 0,
    depthWrite: false,
    dashSize: 0.07,
    gapSize: 0.06,
  });
  private geometries: THREE.BufferGeometry[] = [];
  private sphere = new THREE.SphereGeometry(1, 40, 24);
  private paused = false;
  /** En pantallas verticales el sistema se compacta: órbitas más cerca, cuerpos más grandes */
  private orbitScale = 1;
  private sizeScale = 1;
  private targetOrbitScale = 1;
  private targetSizeScale = 1;
  private tmp = new THREE.Vector3();

  constructor(configs: { key: string; category: ProjectCategory; planet: PlanetConfig }[]) {
    configs.forEach(({ key, category, planet }, i) => {
      const body = category === "current" ? this.makePlanet(planet, i) : this.makeSatellite(planet);
      this.group.add(body.object);
      this.bodies.push({
        key,
        cfg: planet,
        kind: category,
        ...body,
        angle: planet.phase,
        // Órbitas keplerianas: las internas giran más rápido
        speed: 0.22 / Math.pow(planet.orbit, 1.5),
      });

      const points = new THREE.EllipseCurve(0, 0, planet.orbit, planet.orbit).getPoints(160);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, 0, p.y)));
      const orbit =
        category === "current" ? new THREE.LineLoop(orbitGeo, this.orbitMat) : new THREE.Line(orbitGeo, this.dashedMat);
      if (category !== "current") orbit.computeLineDistances();
      orbit.rotation.x = planet.tilt;
      this.orbits.push(orbit);
      this.geometries.push(orbitGeo);
      this.group.add(orbit);
    });
  }

  private makePlanet(cfg: PlanetConfig, i: number) {
    const mat = shaderMat(planetFragment, {
      uLight: { value: new THREE.Color(cfg.light) },
      uDark: { value: new THREE.Color(cfg.dark) },
      uSelected: { value: 0 },
      uSeed: { value: i * 3.7 },
    });
    return { object: new THREE.Mesh(this.sphere, mat), mats: [mat], hitScale: 1 };
  }

  private makeSatellite(cfg: PlanetConfig) {
    const hull = shaderMat(hullFragment, {
      uLight: { value: new THREE.Color(cfg.light) },
      uDark: { value: new THREE.Color(cfg.dark) },
      uSelected: { value: 0 },
    });
    const panelMat = shaderMat(panelFragment, { uSelected: { value: 0 } }, THREE.DoubleSide);

    const sat = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.9, 0.6, 0.6);
    const panelGeo = new THREE.PlaneGeometry(1.3, 0.5);
    const strutGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6);
    const antennaGeo = new THREE.ConeGeometry(0.16, 0.3, 12, 1, true);
    this.geometries.push(bodyGeo, panelGeo, strutGeo, antennaGeo);

    sat.add(new THREE.Mesh(bodyGeo, hull));
    for (const side of [-1, 1]) {
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.x = side * 1.15;
      panel.rotation.x = -Math.PI / 2.4;
      sat.add(panel);
      const strut = new THREE.Mesh(strutGeo, hull);
      strut.rotation.z = Math.PI / 2;
      strut.position.x = side * 0.5;
      sat.add(strut);
    }
    const antenna = new THREE.Mesh(antennaGeo, hull);
    antenna.position.y = 0.45;
    antenna.rotation.x = Math.PI;
    sat.add(antenna);
    sat.rotation.set(0.4, 0, 0.25);

    return { object: sat, mats: [hull, panelMat], hitScale: 1.6 };
  }

  setPaused(paused: boolean) {
    this.paused = paused;
  }

  setCompact(compact: boolean) {
    this.targetOrbitScale = compact ? 0.62 : 1;
    this.targetSizeScale = compact ? 1.4 : 1;
  }

  setSelected(key: string | null) {
    for (const b of this.bodies) for (const m of b.mats) m.uniforms.uSelected.value = b.key === key ? 1 : 0;
  }

  /** Avanza las órbitas y ordena el dibujo respecto del agujero negro */
  update(dt: number, camera: THREE.Camera, orbitOpacity: number, lightMode: number) {
    this.orbitMat.opacity = orbitOpacity * (0.28 - lightMode * 0.08);
    this.orbitMat.color.set(lightMode > 0.5 ? "#8E6118" : "#D4A85A");
    this.dashedMat.opacity = orbitOpacity * (0.4 - lightMode * 0.1);
    this.dashedMat.color.set(lightMode > 0.5 ? "#2B4C9B" : "#A9BFFF");

    const ease = Math.min(1, dt * 3);
    this.orbitScale += (this.targetOrbitScale - this.orbitScale) * ease;
    this.sizeScale += (this.targetSizeScale - this.sizeScale) * ease;
    for (const o of this.orbits) o.scale.setScalar(this.orbitScale);

    const camDir = this.tmp.copy(camera.position).normalize();
    for (const b of this.bodies) {
      if (!this.paused) b.angle += dt * b.speed;
      const orbit = b.cfg.orbit * this.orbitScale;
      const x = Math.cos(b.angle) * orbit;
      const z = Math.sin(b.angle) * orbit;
      b.object.scale.setScalar(b.cfg.size * this.sizeScale);
      b.object.position.set(x, -z * Math.sin(b.cfg.tilt), z * Math.cos(b.cfg.tilt));
      // Los satélites giran lentamente sobre sí mismos
      if (b.kind === "side" && !this.paused) b.object.rotation.y += dt * 0.5;
      // Delante del agujero negro se dibuja encima de su sombra; detrás, queda tapado
      const order = b.object.position.dot(camDir) > 0 ? 11 : 9;
      b.object.traverse((o) => (o.renderOrder = order));
    }
  }

  /** Posiciones en pantalla (px) para que la página ponga botones y hologramas encima */
  project(camera: THREE.PerspectiveCamera, width: number, height: number, shadowRadius: number): PlanetOnScreen[] {
    const fovScale = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) / camera.zoom;
    const hole = new THREE.Vector3(0, 0, 0).project(camera);
    const holeX = (hole.x + 1) / 2 * width;
    const holeY = (1 - hole.y) / 2 * height;
    const holeDist = camera.position.length();
    const holeR = (shadowRadius / (holeDist * fovScale)) * (height / 2);
    const camDir = this.tmp.copy(camera.position).normalize();

    return this.bodies.map((b) => {
      const world = b.object.position;
      const dist = world.distanceTo(camera.position);
      const ndc = world.clone().project(camera);
      const x = (ndc.x + 1) / 2 * width;
      const y = (1 - ndc.y) / 2 * height;
      const r = ((b.cfg.size * this.sizeScale * b.hitScale) / (dist * fovScale)) * (height / 2);
      const behind = world.dot(camDir) < 0;
      const hidden = behind && Math.hypot(x - holeX, y - holeY) < holeR;
      return { key: b.key, x, y, r, visible: ndc.z < 1 && !hidden };
    });
  }

  dispose() {
    this.sphere.dispose();
    this.orbitMat.dispose();
    this.dashedMat.dispose();
    for (const g of this.geometries) g.dispose();
    for (const b of this.bodies) for (const m of b.mats) m.dispose();
  }
}
