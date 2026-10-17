import * as THREE from "three";
import type { PlanetConfig } from "../../data/projects";
import type { PlanetOnScreen } from "./planetBus";

/**
 * Planetas de los proyectos orbitando a Gargantúa.
 * - Cada uno se ilumina desde el agujero negro (el disco de acreción es la fuente de luz),
 *   con bandas de gas y un borde atmosférico.
 * - Sus órbitas se marcan en dorado sólo en la estación de Proyectos.
 * - Cuando un planeta está "fijado" (holograma abierto), todas las órbitas se detienen.
 */

const planetVertex = /* glsl */ `
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

type Planet = {
  key: string;
  cfg: PlanetConfig;
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  angle: number;
  speed: number;
};

export class PlanetSystem {
  readonly group = new THREE.Group();
  private planets: Planet[] = [];
  private orbits: THREE.LineLoop[] = [];
  private orbitMat = new THREE.LineBasicMaterial({
    color: new THREE.Color("#D4A85A"),
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  private geometry = new THREE.SphereGeometry(1, 40, 24);
  private paused = false;
  /** En pantallas verticales el sistema se compacta: órbitas más cerca, planetas más grandes */
  private orbitScale = 1;
  private sizeScale = 1;
  private targetOrbitScale = 1;
  private targetSizeScale = 1;
  private tmp = new THREE.Vector3();

  constructor(configs: { key: string; planet: PlanetConfig }[]) {
    configs.forEach(({ key, planet }, i) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: planetVertex,
        fragmentShader: planetFragment,
        uniforms: {
          uLight: { value: new THREE.Color(planet.light) },
          uDark: { value: new THREE.Color(planet.dark) },
          uSelected: { value: 0 },
          uSeed: { value: i * 3.7 },
        },
        // "Transparente" sólo para entrar en la misma pasada que el agujero negro:
        // así renderOrder decide si el planeta queda delante o detrás de la sombra
        transparent: true,
        depthWrite: true,
      });
      const mesh = new THREE.Mesh(this.geometry, mat);
      mesh.scale.setScalar(planet.size);
      this.group.add(mesh);
      // Órbitas keplerianas: las internas giran más rápido
      this.planets.push({ key, cfg: planet, mesh, mat, angle: planet.phase, speed: 0.22 / Math.pow(planet.orbit, 1.5) });

      const points = new THREE.EllipseCurve(0, 0, planet.orbit, planet.orbit).getPoints(128);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, 0, p.y)));
      const orbit = new THREE.LineLoop(orbitGeo, this.orbitMat);
      orbit.rotation.x = planet.tilt;
      this.orbits.push(orbit);
      this.group.add(orbit);
    });
  }

  setPaused(paused: boolean) {
    this.paused = paused;
  }

  setCompact(compact: boolean) {
    this.targetOrbitScale = compact ? 0.62 : 1;
    this.targetSizeScale = compact ? 1.4 : 1;
  }

  setSelected(key: string | null) {
    for (const p of this.planets) p.mat.uniforms.uSelected.value = p.key === key ? 1 : 0;
  }

  /** Avanza las órbitas y ordena el dibujo respecto del agujero negro */
  update(dt: number, camera: THREE.Camera, orbitOpacity: number, lightMode: number) {
    this.orbitMat.opacity = orbitOpacity * (0.28 - lightMode * 0.08);
    this.orbitMat.color.set(lightMode > 0.5 ? "#8E6118" : "#D4A85A");

    const ease = Math.min(1, dt * 3);
    this.orbitScale += (this.targetOrbitScale - this.orbitScale) * ease;
    this.sizeScale += (this.targetSizeScale - this.sizeScale) * ease;
    for (const o of this.orbits) o.scale.setScalar(this.orbitScale);

    const camDir = this.tmp.copy(camera.position).normalize();
    for (const p of this.planets) {
      if (!this.paused) p.angle += dt * p.speed;
      const orbit = p.cfg.orbit * this.orbitScale;
      const x = Math.cos(p.angle) * orbit;
      const z = Math.sin(p.angle) * orbit;
      p.mesh.scale.setScalar(p.cfg.size * this.sizeScale);
      p.mesh.position.set(x, -z * Math.sin(p.cfg.tilt), z * Math.cos(p.cfg.tilt));
      // Delante del agujero negro se dibuja encima de su sombra; detrás, queda tapado
      p.mesh.renderOrder = p.mesh.position.dot(camDir) > 0 ? 11 : 9;
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

    return this.planets.map((p) => {
      const world = p.mesh.position;
      const dist = world.distanceTo(camera.position);
      const ndc = world.clone().project(camera);
      const x = (ndc.x + 1) / 2 * width;
      const y = (1 - ndc.y) / 2 * height;
      const r = ((p.cfg.size * this.sizeScale) / (dist * fovScale)) * (height / 2);
      const behind = world.dot(camDir) < 0;
      const hidden = behind && Math.hypot(x - holeX, y - holeY) < holeR;
      return { key: p.key, x, y, r, visible: ndc.z < 1 && !hidden };
    });
  }

  dispose() {
    this.geometry.dispose();
    this.orbitMat.dispose();
    for (const p of this.planets) p.mat.dispose();
    for (const o of this.orbits) o.geometry.dispose();
  }
}
