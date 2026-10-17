import * as THREE from "three";
import { PROJECTS } from "../../data/projects";
import { PlanetSystem } from "./PlanetSystem";
import type { PlanetOnScreen } from "./planetBus";

/**
 * Galaxia espiral en WebGL + salto hiperespacial entre "estaciones" (una por sección).
 * Clase imperativa sin React: el componente GalaxyBackground la crea, le pasa la ruta
 * y el tema, y la destruye al desmontar.
 */

export type Station = "intro" | "home" | "about" | "projects" | "contact";
export type Quality = "high" | "medium" | "low";
export type Mode = "light" | "dark";

type View = { pos: THREE.Vector3; target: THREE.Vector3 };

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// Dónde se ubica la cámara en cada sección (y hacia dónde mira)
const STATIONS: Record<Station, View> = {
  // Puerta de entrada: la galaxia lejana asoma abajo, como un horizonte, debajo del texto
  intro: { pos: v(0, 9, 26), target: v(0, 7.4, 0) },
  // El núcleo queda abajo, como un horizonte, para no competir con el texto del hero
  home: { pos: v(0, 3.0, 7.4), target: v(0, 3.4, 0) },
  about: { pos: v(3.4, 1.4, 2.4), target: v(1.0, 0.3, -0.6) },
  // Vista del sistema desde arriba: Gargantúa al centro y los planetas-proyecto en órbita
  projects: { pos: v(0, 2.1, 4.9), target: v(0, 0.75, 0) },
  // De canto y cerca del agujero negro: la vista icónica de Gargantúa
  contact: { pos: v(0.2, 0.26, 2.7), target: v(0, 0.17, 0) },
};

// Cuánto se ve la galaxia en cada estación: junto a Gargantúa manda el horizonte de sucesos
const GALAXY_ALPHA: Record<Station, number> = { intro: 1, home: 1, about: 1, projects: 0.3, contact: 0.3 };

const COUNTS: Record<Quality, number> = { high: 45000, medium: 22000, low: 12000 };
const BASE_FOV = 55;
const AMBIENT_FRAME_MS = 1000 / 30;
const WARP_FOV = 40;

// ---------- Shaders ----------

const pointsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uSpin;
  uniform float uWarp;
  uniform float uLight;

  attribute float aScale;
  attribute float aRandom;
  attribute vec3 aColor;
  attribute vec3 aColorLight;

  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);

    // Rotación diferencial: el centro gira más rápido que los bordes
    float dist = length(world.xz);
    float angle = atan(world.z, world.x) + uSpin * uTime * 0.18 / (dist + 0.6);
    world.x = cos(angle) * dist;
    world.z = sin(angle) * dist;

    vec4 view = viewMatrix * world;
    gl_Position = projectionMatrix * view;

    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 + uWarp * 1.2);
    gl_PointSize *= 1.0 / -view.z;
    // Las partículas muy cercanas a la cámara no deben tapar la escena como manchas
    gl_PointSize = min(gl_PointSize, 14.0 * uPixelRatio);

    vColor = mix(aColor, aColorLight, uLight);
    vTwinkle = 0.7 + 0.3 * sin(uTime * 1.6 + aRandom * 60.0);
  }
`;

const pointsFragment = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = 1.0 - d * 2.0;
    if (strength <= 0.0) discard;
    strength = pow(strength, 2.6);
    gl_FragColor = vec4(vColor, strength * vTwinkle * uAlpha);
  }
`;

const streakVertex = /* glsl */ `
  uniform float uTime;
  uniform float uWarp;
  attribute float aEnd;
  attribute float aLen;
  varying float vAlpha;

  void main() {
    // Las estelas viajan hacia la cámara y se estiran con la intensidad del salto
    float z = mod(position.z + uTime * 70.0, 70.0) - 72.0;
    z -= aEnd * aLen * (0.3 + uWarp * 7.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, z, 1.0);
    vAlpha = uWarp * (1.0 - aEnd * 0.85);
  }
`;

const streakFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor, vAlpha);
  }
`;

// Agujero negro (Gargantúa) con trazado de rayos.
// Cada píxel lanza un rayo desde la cámara y lo curva con la gravedad (aproximación de
// Schwarzschild: a = -1.5·h²·r/|r|⁵, en unidades del radio del horizonte). Si el rayo cae en el
// horizonte, el píxel es negro; si cruza el plano del disco, suma la luz del gas en ese punto.
// Así aparecen solos el disco trasero curvado por arriba y por abajo y el anillo de fotones.
const BH_RS = 0.1; // radio del horizonte en unidades del mundo
const BH_QUAD = 15; // medio lado del área que cubre el efecto, en radios del horizonte

const blackHoleVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const blackHoleFragment = /* glsl */ `
  uniform float uTime;
  uniform float uLight;
  uniform float uScale;
  uniform float uHalf;
  uniform vec3 uCamPos;
  uniform int uSteps;
  varying vec3 vWorld;

  const float INNER = 3.0;   // órbita estable más interna (ISCO)
  const float OUTER = 12.0;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.07 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  // Gas en rotación kepleriana: el interior gira más rápido y estira el gas en filamentos.
  // Dos capas alternadas en ciclos para que el estiramiento no crezca sin límite.
  float flow(float rd, float ang) {
    float omega = 1.1 / pow(rd / INNER, 1.5);
    float period = 10.0;
    float ph1 = fract(uTime / period);
    float ph2 = fract(uTime / period + 0.5);
    float a1 = ang - omega * ph1 * period;
    float a2 = ang - omega * ph2 * period;
    vec2 stretch = vec2(1.0, 3.5); // más fino en el radio que en el ángulo: filamentos
    float s1 = fbm(vec2(cos(a1), sin(a1)) * rd * 1.1 * stretch.x + vec2(rd * 0.6 * stretch.y, 3.1));
    float s2 = fbm(vec2(cos(a2), sin(a2)) * rd * 1.1 * stretch.x + vec2(rd * 0.6 * stretch.y, 7.7));
    float gas = mix(s1, s2, abs(ph1 * 2.0 - 1.0));
    return smoothstep(0.2, 0.85, gas);   // más contraste: filamentos claros y huecos oscuros
  }

  vec3 heat(float t) {
    vec3 white = vec3(1.0, 0.95, 0.88);
    vec3 gold = vec3(1.0, 0.72, 0.38);
    vec3 ember = vec3(0.8, 0.33, 0.14);
    return t < 0.35 ? mix(white, gold, t / 0.35) : mix(gold, ember, (t - 0.35) / 0.65);
  }

  void main() {
    vec3 pos = uCamPos / uScale;
    vec3 vel = normalize(vWorld - uCamPos);
    vec3 hv = cross(pos, vel);
    float h2 = dot(hv, hv);

    vec3 col = vec3(0.0);
    float alpha = 0.0;

    // Límite dinámico a propósito: con una constante, el compilador de Windows (ANGLE/D3D)
    // intenta desenrollar el bucle y la compilación congela la página varios segundos.
    for (int i = 0; i < uSteps; i++) {
      float r = length(pos);
      if (r > 45.0 && dot(pos, vel) > 0.0) break;           // escapó
      float dt = clamp(0.1 * r, 0.02, 2.5);
      vec3 prev = pos;
      vel += -1.5 * h2 * pos / pow(r, 5.0) * dt;
      pos += vel * dt;

      if (length(pos) < 1.0) {                               // cayó en el horizonte
        alpha = 1.0;
        break;
      }

      if (prev.y * pos.y < 0.0) {                            // cruzó el plano del disco
        vec3 hit = mix(prev, pos, prev.y / (prev.y - pos.y));
        float rc = length(hit.xz);
        if (rc > INNER && rc < OUTER) {
          float t = (rc - INNER) / (OUTER - INNER);
          float profile = smoothstep(0.0, 0.05, t) * pow(1.0 - t, 1.3);
          float gas = flow(rc, atan(hit.z, hit.x));
          float density = profile * (0.3 + 1.6 * gas);
          // Doppler: el gas que viene hacia la cámara brilla más
          vec3 tangent = normalize(vec3(-hit.z, 0.0, hit.x));
          float doppler = clamp(1.0 + 0.5 * dot(tangent, -normalize(vel)), 0.35, 1.8);
          doppler *= doppler;
          vec3 c = heat(clamp(t * 1.1 + (1.0 - doppler) * 0.15, 0.0, 1.0)) * density * doppler * 1.7;
          float a = clamp(density * 1.4, 0.0, 0.97);
          col += (1.0 - alpha) * c;
          alpha += (1.0 - alpha) * a;
          if (alpha > 0.985) break;
        }
      }
    }

    // Tone mapping: como la exposición de una cámara, evita que el centro se queme en blanco plano
    col = vec3(1.0) - exp(-col * 1.35);
    col *= vec3(1.0, 0.93, 0.82);

    // Borde suave del área del efecto (fuera de ahí, la escena normal)
    float edge = 1.0 - smoothstep(0.82, 1.0, length(vWorld) / uHalf);
    col *= edge;
    alpha *= edge;

    // Noche: luz que se suma + sombra que tapa. Día: tinta sobre pergamino.
    vec4 night = vec4(col, alpha);
    float cover = clamp(alpha * 0.9 + dot(col, vec3(0.3)) * 0.5, 0.0, 1.0);
    vec4 day = vec4(vec3(0.11, 0.14, 0.25) * cover, cover);
    gl_FragColor = mix(night, day, uLight);
  }
`;

// ---------- Utilidades ----------

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const hex = (h: string) => new THREE.Color(h);

const PALETTE = {
  core: hex("#FFE2B0"),
  gold: hex("#D4A85A"),
  ember: hex("#E07A4F"),
  arm: hex("#5D6FD8"),
  violet: hex("#8C6FE0"),
  // Carta estelar (modo claro): tinta y bronce
  inkCore: hex("#8E6118"),
  ink: hex("#1C2541"),
  inkSoft: hex("#4A5A8C"),
};

type Options = {
  quality: Quality;
  reducedMotion: boolean;
  mode: Mode;
  start: Station;
  /** Intensidad del salto 0..1 en cada frame mientras dura (para el flash del DOM) */
  onWarp?: (intensity: number) => void;
  onArrive?: (station: Station) => void;
  /** Shaders compilados: la escena ya puede dibujarse */
  onReady?: () => void;
  /** Dónde se ve cada planeta en pantalla (en cada frame) */
  onPlanets?: (planets: PlanetOnScreen[]) => void;
};

export class GalaxyScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private galaxy: THREE.Points;
  private sky: THREE.Points;
  private streaks: THREE.LineSegments;
  private grid: THREE.PolarGridHelper;
  private blackHole: THREE.Mesh;
  private blackHoleMat: THREE.ShaderMaterial;
  private galaxyMat: THREE.ShaderMaterial;
  private skyMat: THREE.ShaderMaterial;
  private streakMat: THREE.ShaderMaterial;

  private opts: Options;
  private raf = 0;
  private running = false;
  private clock = new THREE.Clock(false);
  private time = 0;
  private pixelRatio: number;

  // Transición de cámara
  private from: View;
  private to: View;
  private current: View;
  private station: Station;
  private transitionT = 1;
  private transitionDur = 1.7;
  private fromAlpha = 1;

  // Parallax con el puntero
  private pointer = new THREE.Vector2();
  private pointerSmooth = new THREE.Vector2();

  // Tema animado (0 = noche, 1 = carta estelar)
  private compiled = false;
  private planets: PlanetSystem;
  /** 0..1: cuánto "estamos" en la estación de Proyectos (órbitas visibles, encuadre) */
  private projectsFactor = 0;
  private viewW = 1;
  private viewH = 1;
  private baseZoom = 1;
  private light = 0;
  private lightTarget = 0;

  // Calidad adaptativa
  private frameTimes: number[] = [];
  private degraded = false;

  constructor(canvas: HTMLCanvasElement, opts: Options) {
    this.opts = opts;
    this.station = opts.start;
    const start = STATIONS[opts.start];
    this.from = { pos: start.pos.clone(), target: start.target.clone() };
    this.to = { pos: start.pos.clone(), target: start.target.clone() };
    this.current = { pos: start.pos.clone(), target: start.target.clone() };

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, opts.quality === "high" ? 2 : 1.5);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setClearColor(0x000000, 0);

    this.camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.1, 200);
    this.scene.add(this.camera);

    this.galaxyMat = this.makePointsMaterial(28, 1);
    this.skyMat = this.makePointsMaterial(22, 0);
    this.galaxy = new THREE.Points(this.buildGalaxy(COUNTS[opts.quality]), this.galaxyMat);
    this.sky = new THREE.Points(this.buildSky(opts.quality === "low" ? 1200 : 2600), this.skyMat);
    this.scene.add(this.galaxy, this.sky);

    this.blackHoleMat = new THREE.ShaderMaterial({
      vertexShader: blackHoleVertex,
      fragmentShader: blackHoleFragment,
      uniforms: {
        uSteps: { value: opts.quality === "high" ? 150 : opts.quality === "medium" ? 110 : 70 },
        uTime: { value: 0 },
        uLight: { value: 0 },
        uScale: { value: BH_RS },
        uHalf: { value: BH_RS * BH_QUAD },
        uCamPos: { value: new THREE.Vector3() },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      // Luz premultiplicada: el brillo se suma y la sombra tapa lo que hay detrás
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    });
    this.blackHole = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.blackHoleMat);
    this.blackHole.scale.setScalar(BH_RS * BH_QUAD * 2);
    this.blackHole.frustumCulled = false;
    this.blackHole.renderOrder = 10;
    this.scene.add(this.blackHole);

    this.planets = new PlanetSystem(PROJECTS);
    this.scene.add(this.planets.group);

    this.grid = new THREE.PolarGridHelper(6.2, 12, 6, 96);
    const gridMat = this.grid.material as THREE.LineBasicMaterial;
    gridMat.transparent = true;
    gridMat.depthWrite = false;
    this.scene.add(this.grid);

    this.streakMat = new THREE.ShaderMaterial({
      vertexShader: streakVertex,
      fragmentShader: streakFragment,
      uniforms: { uTime: { value: 0 }, uWarp: { value: 0 }, uColor: { value: hex("#FFE9C2") } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.streaks = new THREE.LineSegments(this.buildStreaks(opts.quality === "low" ? 500 : 1100), this.streakMat);
    this.streaks.frustumCulled = false;
    this.streaks.visible = false;
    this.camera.add(this.streaks);

    this.setMode(opts.mode, true);
    this.applyCamera(0);

    // Compilar los shaders en segundo plano (sin bloquear la página) antes de dibujar
    this.renderer
      .compileAsync(this.scene, this.camera)
      .catch(() => undefined)
      .then(() => {
        this.compiled = true;
        this.opts.onReady?.();
      });
  }

  // ---------- Construcción ----------

  private makePointsMaterial(size: number, spin: number) {
    return new THREE.ShaderMaterial({
      vertexShader: pointsVertex,
      fragmentShader: pointsFragment,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
        uPixelRatio: { value: this.pixelRatio },
        uSpin: { value: spin },
        uWarp: { value: 0 },
        uLight: { value: 0 },
        uAlpha: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }

  private buildGalaxy(count: number) {
    const radius = 5.2;
    const branches = 4;
    const spin = 1.15;
    const randomness = 0.32;
    const power = 2.8;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorsLight = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randoms = new Float32Array(count);
    const c = new THREE.Color();
    const cl = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Las estrellas arrancan fuera del disco de acreción: cerca del agujero negro sólo hay gas
      const r = 1.25 + Math.pow(Math.random(), 1.2) * (radius - 1.25);
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;
      const rnd = () => Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * (r + 0.3);

      positions[i * 3] = Math.cos(branchAngle + spinAngle) * r + rnd();
      positions[i * 3 + 1] = rnd() * 0.45;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + rnd();

      // Núcleo dorado → brazos azul/violeta, con chispas de brasa
      const t = r / radius;
      if (t < 0.18) c.copy(PALETTE.core).lerp(PALETTE.gold, t / 0.18);
      else c.copy(PALETTE.gold).lerp(Math.random() < 0.5 ? PALETTE.arm : PALETTE.violet, Math.min(1, (t - 0.18) * 1.6));
      if (Math.random() < 0.025) c.copy(PALETTE.ember);
      colors.set([c.r, c.g, c.b], i * 3);

      cl.copy(PALETTE.inkCore).lerp(Math.random() < 0.6 ? PALETTE.ink : PALETTE.inkSoft, Math.min(1, t * 2.2));
      colorsLight.set([cl.r, cl.g, cl.b], i * 3);

      scales[i] = Math.random() < 0.03 ? 2.2 + Math.random() * 1.5 : 0.4 + Math.random() * 0.9;
      // El centro es muy denso: puntos más chicos para que no se "queme" en blanco
      if (t < 0.12) scales[i] *= 0.45 + t * 4;
      randoms[i] = Math.random();
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("aColorLight", new THREE.BufferAttribute(colorsLight, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    return g;
  }

  private buildSky(count: number) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorsLight = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randoms = new Float32Array(count);
    const warm = hex("#FFF1DA");
    const cool = hex("#C9D4FF");
    const c = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Distribución uniforme en una cáscara esférica lejana
      const u = Math.random() * 2 - 1;
      const phi = Math.random() * Math.PI * 2;
      const rad = 35 + Math.random() * 40;
      const s = Math.sqrt(1 - u * u);
      positions.set([Math.cos(phi) * s * rad, u * rad, Math.sin(phi) * s * rad], i * 3);
      c.copy(warm).lerp(cool, Math.random());
      colors.set([c.r, c.g, c.b], i * 3);
      colorsLight.set([PALETTE.ink.r, PALETTE.ink.g, PALETTE.ink.b], i * 3);
      scales[i] = 1.5 + Math.random() * 3.5;
      randoms[i] = Math.random();
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("aColorLight", new THREE.BufferAttribute(colorsLight, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    return g;
  }

  private buildStreaks(count: number) {
    const positions = new Float32Array(count * 2 * 3);
    const ends = new Float32Array(count * 2);
    const lens = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      // Un túnel alrededor del eje de la cámara
      const a = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.pow(Math.random(), 0.6) * 5;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      const z = Math.random() * 70;
      const len = 0.6 + Math.random() * 1.6;
      for (let k = 0; k < 2; k++) {
        positions.set([x, y, z], (i * 2 + k) * 3);
        ends[i * 2 + k] = k;
        lens[i * 2 + k] = len;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aEnd", new THREE.BufferAttribute(ends, 1));
    g.setAttribute("aLen", new THREE.BufferAttribute(lens, 1));
    return g;
  }

  // ---------- API pública ----------

  setStation(station: Station, opts: { instant?: boolean; duration?: number } = {}) {
    if (station === this.station && this.transitionT >= 1) return;
    this.fromAlpha = this.galaxyMat.uniforms.uAlpha.value;
    this.station = station;
    this.from = { pos: this.current.pos.clone(), target: this.current.target.clone() };
    this.to = { pos: STATIONS[station].pos.clone(), target: STATIONS[station].target.clone() };
    if (opts.instant || this.opts.reducedMotion) {
      this.transitionT = 1;
      this.applyCamera(0);
      this.opts.onArrive?.(station);
      if (!this.running) this.renderOnce();
      return;
    }
    this.transitionDur = opts.duration ?? 1.7;
    this.transitionT = 0;
  }

  setMode(mode: Mode, immediate = false) {
    this.lightTarget = mode === "light" ? 1 : 0;
    if (immediate || this.opts.reducedMotion) this.light = this.lightTarget;
    // En modo claro los puntos se dibujan como tinta (mezcla normal), no como luz
    const blending = mode === "light" ? THREE.NormalBlending : THREE.AdditiveBlending;
    for (const m of [this.galaxyMat, this.skyMat]) {
      m.blending = blending;
      m.needsUpdate = true;
    }
    const gridMat = this.grid.material as THREE.LineBasicMaterial;
    gridMat.color = hex(mode === "light" ? "#8E6118" : "#D4A85A");
    gridMat.opacity = mode === "light" ? 0.22 : 0.07;
    if (!this.running) this.renderOnce();
  }

  setReducedMotion(reduced: boolean) {
    this.opts.reducedMotion = reduced;
  }

  /** Fijar un planeta (holograma abierto) detiene las órbitas y lo resalta */
  focusPlanet(key: string | null) {
    this.planets.setPaused(key !== null);
    this.planets.setSelected(key);
  }

  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(1, height);
    // En pantallas angostas alejamos un poco la cámara para que entre la galaxia
    this.baseZoom = width < 700 ? 0.72 : 1;
    this.viewW = width;
    this.viewH = height;
    this.camera.zoom = this.baseZoom;
    this.camera.updateProjectionMatrix();
    this.planets.setCompact(width / Math.max(1, height) < 1.1);
    if (!this.running) this.renderOnce();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    // En reposo alcanza con 30 fps (el movimiento es lento); durante un salto, todos los que haya
    let last = 0;
    const loop = (now: number) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      const interval = this.transitionT < 1 ? 0 : AMBIENT_FRAME_MS;
      if (now - last < interval - 2) return;
      last = now;
      this.frame();
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    this.clock.stop();
    cancelAnimationFrame(this.raf);
  }

  dispose() {
    this.stop();
    this.galaxy.geometry.dispose();
    this.sky.geometry.dispose();
    this.streaks.geometry.dispose();
    this.galaxyMat.dispose();
    this.skyMat.dispose();
    this.streakMat.dispose();
    this.grid.geometry.dispose();
    this.blackHole.geometry.dispose();
    this.blackHoleMat.dispose();
    this.planets.dispose();
    (this.grid.material as THREE.Material).dispose();
    this.renderer.dispose();
  }

  // ---------- Frame ----------

  private frame() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (!this.compiled) return;
    // Con "reducir movimiento" el gas sigue fluyendo, pero más lento (sin saltos ni intro)
    this.time += dt * (this.opts.reducedMotion ? 0.4 : 1);
    this.trackPerformance(dt);

    // Transición de cámara con salto
    let warp = 0;
    if (this.transitionT < 1) {
      this.transitionT = Math.min(1, this.transitionT + dt / this.transitionDur);
      warp = Math.pow(Math.sin(Math.PI * this.transitionT), 1.4);
      this.opts.onWarp?.(warp);
      if (this.transitionT >= 1) {
        this.opts.onWarp?.(0);
        this.opts.onArrive?.(this.station);
      }
    }

    this.light += (this.lightTarget - this.light) * Math.min(1, dt * 4);
    this.pointerSmooth.lerp(this.pointer, Math.min(1, dt * 3));
    const projectsTarget = this.station === "projects" ? easeInOutCubic(this.transitionT) : 0;
    this.projectsFactor += (projectsTarget - this.projectsFactor) * Math.min(1, dt * 3);
    this.applyCamera(warp);

    for (const m of [this.galaxyMat, this.skyMat]) {
      m.uniforms.uTime.value = this.time;
      m.uniforms.uWarp.value = warp;
      m.uniforms.uLight.value = this.light;
    }
    const stationAlpha =
      GALAXY_ALPHA[this.station] * easeInOutCubic(this.transitionT) +
      this.fromAlpha * (1 - easeInOutCubic(this.transitionT));
    this.galaxyMat.uniforms.uAlpha.value = stationAlpha * (1 - this.light * 0.15);
    this.skyMat.uniforms.uAlpha.value = 1 - this.light * 0.55;
    this.streakMat.uniforms.uTime.value = this.time;
    this.streakMat.uniforms.uWarp.value = warp * (1 - this.light * 0.6);
    this.streaks.visible = warp > 0.01;
    this.grid.rotation.y = this.time * 0.02;
    this.updateBlackHole();
    this.planets.update(dt * (this.opts.reducedMotion ? 0.4 : 1), this.camera, this.projectsFactor, this.light);

    this.renderer.render(this.scene, this.camera);

    if (this.opts.onPlanets) {
      this.opts.onPlanets(this.planets.project(this.camera, this.viewW, this.viewH, BH_RS * 2.6));
    }
  }

  private applyCamera(warp: number) {
    const e = easeInOutCubic(this.transitionT);
    this.current.pos.lerpVectors(this.from.pos, this.to.pos, e);
    this.current.target.lerpVectors(this.from.target, this.to.target, e);

    // Parallax suave: la cámara se desplaza un poco siguiendo al puntero
    const cam = this.camera;
    cam.position.copy(this.current.pos);
    cam.lookAt(this.current.target);
    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
    cam.position.addScaledVector(right, this.pointerSmooth.x * 0.35).addScaledVector(up, this.pointerSmooth.y * 0.2);
    cam.lookAt(this.current.target);

    const aspect = this.viewW / this.viewH;
    const portraitZoom = aspect < 1.1 ? Math.min(1, Math.max(0.6, aspect * 1.95)) : 1;
    cam.zoom = this.baseZoom * (1 + (portraitZoom - 1) * this.projectsFactor);
    // En Proyectos el sistema baja en pantalla para dejar lugar al título (más en pantallas verticales)
    const shift = this.viewH * (aspect < 1.1 ? 0.08 : 0.04) * this.projectsFactor;
    if (shift > 0.5) cam.setViewOffset(this.viewW, this.viewH, 0, -shift, this.viewW, this.viewH);
    else cam.clearViewOffset();
    cam.fov = BASE_FOV + WARP_FOV * warp;
    cam.updateProjectionMatrix();
  }

  /** Sincroniza el agujero negro con la cámara antes de dibujar */
  private updateBlackHole() {
    // El área del efecto siempre mira a la cámara; la física del rayo hace el resto
    this.blackHole.quaternion.copy(this.camera.quaternion);
    this.blackHole.updateMatrixWorld();
    const u = this.blackHoleMat.uniforms;
    (u.uCamPos.value as THREE.Vector3).copy(this.camera.position);
    u.uTime.value = this.time;
    u.uLight.value = this.light;
  }

  private renderOnce() {
    if (!this.compiled) return;
    this.applyCamera(0);
    this.updateBlackHole();
    for (const m of [this.galaxyMat, this.skyMat]) m.uniforms.uLight.value = this.light;
    this.renderer.render(this.scene, this.camera);
  }

  /** Si el equipo no sostiene ni ~22 fps en reposo, bajamos resolución y cantidad de partículas */
  private trackPerformance(dt: number) {
    if (this.degraded || this.transitionT < 1) return;
    this.frameTimes.push(dt);
    if (this.frameTimes.length < 120) return;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.frameTimes = [];
    if (avg > (AMBIENT_FRAME_MS / 1000) * 1.35) {
      this.degraded = true;
      this.pixelRatio = 1;
      this.renderer.setPixelRatio(1);
      for (const m of [this.galaxyMat, this.skyMat]) m.uniforms.uPixelRatio.value = 1;
      const count = this.galaxy.geometry.getAttribute("position").count;
      this.galaxy.geometry.setDrawRange(0, Math.floor(count * 0.55));
    }
  }
}
