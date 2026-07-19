// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝

/**
 * Generated-wallpaper shaders (seed 3140, "contrast orange" palette).
 *
 * All three effects share the prelude below. Only the contour effect uses the
 * simplex/fbm block; moiré and cells rely on the cheap hashes above it.
 */

/** Fullscreen triangle — no vertex buffer, position derived from gl_VertexID. */
export const VERTEX_SHADER = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`

const PRELUDE = `#version 300 es
precision highp float;

out vec4 outColor;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec3  u_colors[8];
uniform int   u_colorCount;
uniform float u_seed;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

// 2D simplex noise (Ian McEwan / Ashima Arts, public domain style). Contour only.
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p = rot * p * 2.0 + 11.7;
    a *= 0.5;
  }
  return v;
}

vec2 seedOffset() {
  return vec2(hash11(u_seed * 0.7131), hash11(u_seed * 1.3719)) * 512.0;
}

// Centered, aspect-corrected coordinates. Short edge spans [-0.5, 0.5].
vec2 uvCoord() {
  return (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
}

// Smooth wrap-around sample of the active palette. t is free-running.
vec3 getColor(float t) {
  float n = float(u_colorCount);
  float x = fract(t) * n;
  int i = int(x) % u_colorCount;
  int j = (i + 1) % u_colorCount;
  float f = smoothstep(0.0, 1.0, fract(x));
  return mix(u_colors[i], u_colors[j], f);
}
`

/** Three concentric ring fields on slow Lissajous drift, multiplied to interfere. */
export const MOIRE_FS = `${PRELUDE}
uniform float u_rings;
uniform float u_freq;
uniform float u_sep;
uniform float u_soft;
uniform float u_speed;

void main() {
  vec2 uv = uvCoord();
  float t = u_time * u_speed * 0.15;
  float sd = hash11(u_seed) * 6.2831;

  int n = int(u_rings + 0.5);
  float v = 1.0;
  for (int i = 0; i < 3; i++) {
    if (i >= n) break;
    float fi = float(i);
    vec2 c = u_sep * vec2(
      sin(t * (0.9 + fi * 0.31) + sd + fi * 2.1),
      cos(t * (0.7 + fi * 0.23) + sd * 1.7 + fi * 4.3)
    );
    float phase = length(uv - c) * u_freq;
    float att = smoothstep(2.8, 1.0, fwidth(phase)); // anti-alias fade
    float ring = cos(phase) * att;
    v *= mix(ring, ring * 0.5 + 0.5, u_soft) * 2.0 - (1.0 - u_soft);
  }
  v = clamp(v * 0.5 + 0.5, 0.0, 1.0);

  vec3 dark = getColor(0.0) * 0.10;
  vec3 lit = getColor(v * 0.35 + length(uv) * 0.3 + t * 0.1);
  vec3 col = mix(dark, lit, v);

  outColor = vec4(col, 1.0);
}
`

/** Voronoi cells whose sites orbit their home tile; flat fill when u_edgeWidth is 0. */
export const CELLS_FS = `${PRELUDE}
uniform float u_cellCount;
uniform float u_speed;
uniform float u_edgeWidth;
uniform float u_shade;

void main() {
  vec2 uv = uvCoord();
  vec2 so = seedOffset();
  float t = u_time * u_speed;

  vec2 p = (uv + 0.5) * u_cellCount;
  vec2 g = floor(p);
  vec2 f = fract(p);

  float F1 = 8.0;
  float F2 = 8.0;
  vec2 winner = vec2(0.0);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 o = vec2(float(x), float(y));
      vec2 h = hash22(g + o + so);
      vec2 site = o + 0.5 + 0.38 * sin(t * (0.5 + h) + h * 6.2831) - f;
      float d = dot(site, site);
      if (d < F1) {
        F2 = F1;
        F1 = d;
        winner = g + o;
      } else if (d < F2) {
        F2 = d;
      }
    }
  }

  F1 = sqrt(F1);
  F2 = sqrt(F2);

  float h1 = hash21(winner + so);
  vec3 cellCol = getColor(h1 * 0.9 + t * 0.008);

  // shade toward the cell edge for a glassy bevel
  cellCol *= 1.0 - u_shade * smoothstep(0.0, 0.9, F1);

  // grout along equidistant boundaries
  float aa = fwidth(F2 - F1) * 1.5;
  float edge = smoothstep(u_edgeWidth + aa, u_edgeWidth - aa, F2 - F1);
  vec3 grout = getColor(0.0) * 0.15;

  outColor = vec4(mix(cellCol, grout, edge * step(0.001, u_edgeWidth)), 1.0);
}
`

/** Banded fbm heightfield with an iso-line drawn at each level break. */
export const CONTOUR_FS = `${PRELUDE}
uniform float u_scale;
uniform float u_levels;
uniform float u_thickness;
uniform float u_speed;

void main() {
  vec2 uv = uvCoord();
  vec2 so = seedOffset() * 0.01;
  float t = u_time * u_speed * 0.1;

  vec2 p = uv * u_scale + so;
  float h = fbm(p + vec2(t * 0.6, -t * 0.4)) * 0.5 + 0.5;
  h = clamp(h, 0.0, 0.999);

  float lv = h * u_levels;
  float band = floor(lv);

  vec3 col = getColor(band / u_levels * 0.9 + t * 0.05);
  // gentle shading within each band for depth
  col *= 0.9 + 0.1 * fract(lv);

  // iso-line at each integer level, AA'd against the heightfield gradient
  float dLine = abs(fract(lv + 0.5) - 0.5);
  float aa = fwidth(lv);
  float line = 1.0 - smoothstep(u_thickness, u_thickness + aa * 1.5, dLine);

  vec3 ink = getColor(0.0) * 0.2;
  outColor = vec4(mix(col, ink, line * step(0.001, u_thickness)), 1.0);
}
`

/**
 * Shared palette: deep indigo, amber, orange, red-orange, forest.
 * The upstream 5th colour was #33b533 green; swapped for --m-sig-forest so the
 * ramp stays inside the site's signature range. Padded to 8 slots for u_colors.
 */
const PALETTE = [
  0.16862745098039217, 0.17647058823529413, 0.39215686274509803, // #2b2d64
  1, 0.7058823529411765, 0.3607843137254902,                     // #ffb45c
  1, 0.44313725490196076, 0.07058823529411765,                   // #ff7112
  0.9490196078431372, 0.26666666666666666, 0.0196078431372549,   // #f24405
  0.0392156862745098, 0.1803921568627451, 0.054901960784313725,  // #0a2e0e
  0.16862745098039217, 0.17647058823529413, 0.39215686274509803,
  1, 0.7058823529411765, 0.3607843137254902,
  1, 0.44313725490196076, 0.07058823529411765,
]

/**
 * Tuned for the ~160px-tall card viewport. u_freq drops from the upstream 198
 * because the shader normalises to the short edge — at 198 the rings land near
 * 5px apart and the built-in anti-alias fade starts greying them out.
 */
export const MOIRE_CFG = {
  fragmentShader: MOIRE_FS,
  uniforms: { u_rings: 3, u_freq: 110, u_sep: 0.28, u_soft: 0.64, u_speed: 0.5 },
  colors: PALETTE,
  colorCount: 5,
  seed: 3140,
  startTime: 63.58384,
}

/** Upstream values; the contour scale already suits a panel this size. */
export const CONTOUR_CFG = {
  fragmentShader: CONTOUR_FS,
  uniforms: { u_scale: 1.8, u_levels: 10, u_thickness: 0.06, u_speed: 0.6 },
  colors: PALETTE,
  colorCount: 5,
  seed: 3140,
  startTime: 749.3797,
}

/**
 * Tuned for the ~200px-tall rail panel. Upstream had cellCount 20 / speed 2.2,
 * which at this size is a jittery 13px mosaic; chunkier and slower reads as a
 * deliberate colour-block rather than noise.
 */
export const CELLS_CFG = {
  fragmentShader: CELLS_FS,
  uniforms: { u_cellCount: 8, u_speed: 0.9, u_edgeWidth: 0, u_shade: 0 },
  colors: PALETTE,
  colorCount: 5,
  seed: 3140,
  startTime: 165.95584,
}
