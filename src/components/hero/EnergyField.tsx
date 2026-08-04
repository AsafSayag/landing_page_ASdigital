"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
   ענן אנרגיה שקט. ככל שהמשתמש עונה, חלקיקים עוזבים את הענן
   ומתאספים במסלול רך סביב אמבלם "העסק שלך".
   שקט, איטי, לא מסיח — התוכן הוא הגיבור.
--------------------------------------------------------------------------- */

const SPHERE_HIGH = 5200;
const SPHERE_LOW = 2700;
const GATHER_HIGH = 6000;
const GATHER_LOW = 3000;

const SPHERE_R = 1.37;

const C_DIM = new THREE.Color("#628fb0");
const C_LIVE = new THREE.Color("#cfeeff");
const C_ACCENT = new THREE.Color("#6cc8ff");

/* ------------------------------ ענן האנרגיה ------------------------------ */

const SPHERE_VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uSizeMul;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  uniform float uMouseR;
  varying float vA;
  varying float vGlow;

  void main() {
    vec3 p = position;
    float n = sin(uTime * 0.09 + aSeed * 6.2831) * 0.5 + 0.5;
    p += normalize(p) * (0.035 * n);

    float d = distance(p.xy, uMouse);
    float infl = (1.0 - smoothstep(0.0, uMouseR, d)) * uMouseActive;
    p.xy += normalize(uMouse - p.xy + vec2(1e-5)) * infl * 0.045;
    vGlow = infl;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uSizeMul * (0.45 + aSeed * 0.7)
                   * uPixelRatio * (6.4 / max(-mv.z, 0.1));

    float edge = 1.0 - smoothstep(0.62, 1.06, length(p.xy) / ${SPHERE_R.toFixed(2)});
    float drain = 1.0 - uProgress * 0.55;
    // הבהוב עדין מאוד — "חיים" בלי רעש
    float twinkle = 0.85 + 0.15 * sin(uTime * 0.5 + aSeed * 12.0);
    vA = (0.62 + 0.48 * n) * edge * drain * twinkle;
  }
`;

const SPHERE_FRAG = /* glsl */ `
  uniform vec3 uDim;
  uniform vec3 uAccent;
  uniform float uAlphaMul;
  uniform float uFocus;
  varying float vA;
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uDim, uAccent, vGlow * 0.7);
    gl_FragColor = vec4(col, soft * vA * (1.0 + vGlow * 0.8) * uAlphaMul * uFocus);
  }
`;

/* --------------------- חלקיקים שמתאספים סביב הענן --------------------- */

const GATHER_VERT = /* glsl */ `
  attribute vec3 aSource;   // מוצא על הענן
  attribute vec3 aOrbit;    // מיקום יחסי במסלול סביב האמבלם
  attribute vec3 aCurve;    // בקרת עקומה
  attribute float aOrder;
  attribute float aSpin;    // מהירות הקפה
  attribute float aSeed;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uTarget;     // מרכז האמבלם בקואורדינטות עולם
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uSizeMul;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  uniform float uMouseR;
  varying float vA;
  varying float vArrive;
  varying float vGlow;

  void main() {
    float band = 0.32;
    float local = clamp((uProgress * (1.0 + band) - aOrder) / band, 0.0, 1.0);
    float e = local * local * (3.0 - 2.0 * local);

    // הקפה איטית סביב האמבלם
    float ang = uTime * aSpin * 0.11;
    float ca = cos(ang), sa = sin(ang);
    vec3 orb = aOrbit;
    orb.xy = mat2(ca, -sa, sa, ca) * orb.xy;
    vec3 tgt = vec3(uTarget, 0.0) + orb;

    vec3 src = aSource;
    vec3 mid = mix(src, tgt, 0.5) + aCurve;
    vec3 p = mix(mix(src, mid, e), mix(mid, tgt, e), e);

    float d = distance(p.xy, uMouse);
    float infl = (1.0 - smoothstep(0.0, uMouseR, d)) * uMouseActive;
    p.xy += normalize(uMouse - p.xy + vec2(1e-5)) * infl * 0.04;
    vGlow = infl;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uSizeMul * (0.5 + aSeed * 0.6) * (1.0 + e * 0.3)
                   * uPixelRatio * (6.4 / max(-mv.z, 0.1));

    vArrive = e;
    float edge = 1.0 - smoothstep(0.62, 1.06, length(src.xy) / ${SPHERE_R.toFixed(2)});
    float restAlpha = (0.42 * edge) * (1.0 - uProgress * 0.4);
    float twinkle = 0.82 + 0.18 * sin(uTime * 0.6 + aSeed * 9.0);
    vA = mix(restAlpha, 0.5, e) * twinkle;
  }
`;

const GATHER_FRAG = /* glsl */ `
  uniform vec3 uDim;
  uniform vec3 uLive;
  uniform vec3 uAccent;
  uniform float uAlphaMul;
  uniform float uFocus;
  varying float vA;
  varying float vArrive;
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.2, 0.0, d);

    vec3 col = mix(uDim, uLive, vArrive);
    col = mix(col, uAccent, (1.0 - vArrive) * 0.4);
    col += core * 0.12 * vArrive;
    col += vGlow * 0.3;

    gl_FragColor = vec4(col, soft * vA * (1.0 + vGlow * 0.5) * uAlphaMul * uFocus);
  }
`;

export default function EnergyField({
  progress,
  focus,
  targetNdc,
  quality = "high",
  scale = 1,
}: {
  progress: number;
  focus: number;
  targetNdc: { x: number; y: number };
  quality?: "high" | "low";
  scale?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const sphereGroup = useRef<THREE.Group>(null);
  const sphereCoreM = useRef<THREE.ShaderMaterial>(null);
  const sphereHaloM = useRef<THREE.ShaderMaterial>(null);
  const gatherCoreM = useRef<THREE.ShaderMaterial>(null);
  const gatherHaloM = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();

  const SPHERE_COUNT = quality === "low" ? SPHERE_LOW : SPHERE_HIGH;
  const GATHER_COUNT = quality === "low" ? GATHER_LOW : GATHER_HIGH;

  const { sphereGeo, gatherGeo } = useMemo(() => {
    let seed = 20260805;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const sphereAt = (i: number, n: number) => {
      const y = 1 - (i / Math.max(n - 1, 1)) * 2;
      const rr = Math.sqrt(Math.max(0, 1 - y * y));
      const th = Math.PI * (3 - Math.sqrt(5)) * i;
      return new THREE.Vector3(Math.cos(th) * rr, y, Math.sin(th) * rr)
        .normalize()
        .multiplyScalar(SPHERE_R * (0.9 + rand() * 0.14));
    };

    const sPos = new Float32Array(SPHERE_COUNT * 3);
    const sSeed = new Float32Array(SPHERE_COUNT);
    for (let i = 0; i < SPHERE_COUNT; i++) {
      const v = sphereAt(i, SPHERE_COUNT);
      sPos[i * 3] = v.x;
      sPos[i * 3 + 1] = v.y;
      sPos[i * 3 + 2] = v.z;
      sSeed[i] = rand();
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    sg.setAttribute("aSeed", new THREE.BufferAttribute(sSeed, 1));

    /* מסלול רך סביב האמבלם */
    const gPos = new Float32Array(GATHER_COUNT * 3);
    const gSrc = new Float32Array(GATHER_COUNT * 3);
    const gOrbit = new Float32Array(GATHER_COUNT * 3);
    const gCurve = new Float32Array(GATHER_COUNT * 3);
    const gOrder = new Float32Array(GATHER_COUNT);
    const gSpin = new Float32Array(GATHER_COUNT);
    const gSeed = new Float32Array(GATHER_COUNT);

    for (let i = 0; i < GATHER_COUNT; i++) {
      const ang = rand() * Math.PI * 2;
      // רצועה טבעתית — צפופה קרוב לאמבלם, מתפוגגת החוצה
      const rr = 0.26 + Math.pow(rand(), 0.7) * 0.46;
      const ox = Math.cos(ang) * rr * 1.15;
      const oy = Math.sin(ang) * rr * 0.72;
      const oz = (rand() - 0.5) * 0.32;
      gOrbit[i * 3] = ox;
      gOrbit[i * 3 + 1] = oy;
      gOrbit[i * 3 + 2] = oz;
      gPos[i * 3] = ox;
      gPos[i * 3 + 1] = oy;
      gPos[i * 3 + 2] = oz;

      const src = sphereAt(Math.floor(rand() * SPHERE_COUNT), SPHERE_COUNT);
      gSrc[i * 3] = src.x;
      gSrc[i * 3 + 1] = src.y;
      gSrc[i * 3 + 2] = src.z;

      gCurve[i * 3] = (rand() - 0.5) * 0.9;
      gCurve[i * 3 + 1] = (rand() - 0.5) * 0.9;
      gCurve[i * 3 + 2] = 0.3 + rand() * 0.45;

      // הקרובים לאמבלם מתאספים ראשונים
      gOrder[i] = Math.min(1, (rr - 0.26) / 0.46 + rand() * 0.14);
      gSpin[i] = 0.5 + rand() * 0.9;
      gSeed[i] = rand();
    }

    const gg = new THREE.BufferGeometry();
    gg.setAttribute("position", new THREE.BufferAttribute(gPos, 3));
    gg.setAttribute("aSource", new THREE.BufferAttribute(gSrc, 3));
    gg.setAttribute("aOrbit", new THREE.BufferAttribute(gOrbit, 3));
    gg.setAttribute("aCurve", new THREE.BufferAttribute(gCurve, 3));
    gg.setAttribute("aOrder", new THREE.BufferAttribute(gOrder, 1));
    gg.setAttribute("aSpin", new THREE.BufferAttribute(gSpin, 1));
    gg.setAttribute("aSeed", new THREE.BufferAttribute(gSeed, 1));

    return { sphereGeo: sg, gatherGeo: gg };
  }, [SPHERE_COUNT, GATHER_COUNT]);

  const mkSphereU = (sizeMul: number, alphaMul: number) => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPixelRatio: { value: 1 },
    uSize: { value: 5.2 },
    uSizeMul: { value: sizeMul },
    uAlphaMul: { value: alphaMul },
    uFocus: { value: 1 },
    uMouse: { value: new THREE.Vector2(999, 999) },
    uMouseActive: { value: 0 },
    uMouseR: { value: 0.85 },
    uDim: { value: C_DIM },
    uAccent: { value: C_ACCENT },
  });

  const mkGatherU = (sizeMul: number, alphaMul: number) => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uTarget: { value: new THREE.Vector2(0, 0) },
    uPixelRatio: { value: 1 },
    uSize: { value: 4.2 },
    uSizeMul: { value: sizeMul },
    uAlphaMul: { value: alphaMul },
    uFocus: { value: 1 },
    uMouse: { value: new THREE.Vector2(999, 999) },
    uMouseActive: { value: 0 },
    uMouseR: { value: 0.85 },
    uDim: { value: C_DIM },
    uLive: { value: C_LIVE },
    uAccent: { value: C_ACCENT },
  });

  const sphereCoreU = useMemo(() => mkSphereU(1, 1), []);
  const sphereHaloU = useMemo(() => mkSphereU(3.2, 0.18), []);
  const gatherCoreU = useMemo(() => mkGatherU(1, 0.5), []);
  const gatherHaloU = useMemo(() => mkGatherU(3.0, 0.07), []);

  const st = useRef({ progress: 0.15, focus: 1, mouseActive: 0 });
  const mouseWorld = useRef(new THREE.Vector2(999, 999));
  const targetWorld = useRef(new THREE.Vector2(0, 0));
  const lastPointer = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dpr = Math.min(state.viewport.dpr || 1, 2);
    const s = st.current;
    const k = 1 - Math.pow(0.06, delta);

    s.progress += (progress - s.progress) * k * 0.55;
    s.focus += (focus - s.focus) * k;

    const px = state.pointer.x;
    const py = state.pointer.y;
    const moved = Math.abs(px - lastPointer.current.x) + Math.abs(py - lastPointer.current.y);
    lastPointer.current.set(px, py);
    if (moved > 0.0008) s.mouseActive = Math.min(1, s.mouseActive + delta * 5);
    else s.mouseActive = Math.max(0, s.mouseActive - delta * 0.9);

    const toWorld = (nx: number, ny: number) => {
      const v = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
      const dir = v.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      return camera.position.clone().add(dir.multiplyScalar(dist));
    };

    const mw = toWorld(px, py);
    mouseWorld.current.lerp(new THREE.Vector2(mw.x, mw.y), 0.12);

    const tw = toWorld(targetNdc.x, targetNdc.y);
    targetWorld.current.lerp(new THREE.Vector2(tw.x, tw.y), 0.1);

    const sphereMats = [sphereCoreM.current, sphereHaloM.current].filter(Boolean) as THREE.ShaderMaterial[];
    const gatherMats = [gatherCoreM.current, gatherHaloM.current].filter(Boolean) as THREE.ShaderMaterial[];

    for (const m of sphereMats) {
      const u = m.uniforms;
      u.uTime.value = t;
      u.uProgress.value = s.progress;
      u.uPixelRatio.value = dpr;
      u.uFocus.value = s.focus;
      u.uMouse.value.copy(mouseWorld.current);
      u.uMouseActive.value = s.mouseActive;
    }
    for (const m of gatherMats) {
      const u = m.uniforms;
      u.uTime.value = t;
      u.uProgress.value = s.progress;
      u.uPixelRatio.value = dpr;
      u.uFocus.value = s.focus;
      u.uMouse.value.copy(mouseWorld.current);
      u.uMouseActive.value = s.mouseActive;
      u.uTarget.value.copy(targetWorld.current);
    }

    if (sphereGroup.current) sphereGroup.current.rotation.y = t * 0.012;
    if (root.current) {
      root.current.rotation.y = state.pointer.x * 0.05;
      root.current.rotation.x = -state.pointer.y * 0.035;
      root.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={root}>
      <group ref={sphereGroup}>
        <points geometry={sphereGeo} frustumCulled={false} renderOrder={0}>
          <shaderMaterial
            ref={sphereHaloM}
            uniforms={sphereHaloU}
            vertexShader={SPHERE_VERT}
            fragmentShader={SPHERE_FRAG}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
        <points geometry={sphereGeo} frustumCulled={false} renderOrder={1}>
          <shaderMaterial
            ref={sphereCoreM}
            uniforms={sphereCoreU}
            vertexShader={SPHERE_VERT}
            fragmentShader={SPHERE_FRAG}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      <points geometry={gatherGeo} frustumCulled={false} renderOrder={2}>
        <shaderMaterial
          ref={gatherHaloM}
          uniforms={gatherHaloU}
          vertexShader={GATHER_VERT}
          fragmentShader={GATHER_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points geometry={gatherGeo} frustumCulled={false} renderOrder={3}>
        <shaderMaterial
          ref={gatherCoreM}
          uniforms={gatherCoreU}
          vertexShader={GATHER_VERT}
          fragmentShader={GATHER_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
