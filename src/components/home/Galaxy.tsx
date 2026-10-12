"use client";

import { useEffect, useRef } from "react";

/**
 * Milky Way hero. A canvas spiral galaxy: ~thousands of stars on four
 * logarithmic arms with differential rotation, a pre-rendered nebula and
 * dust-lane texture, a bright bulge, a twinkling background and occasional
 * shooting stars.
 *
 * Interaction: the pointer parallaxes and tilts the disc and lights up nearby
 * stars, dragging spins it with inertia, a click sends a shockwave through it,
 * and scrolling pulls it closer. It pauses off-screen, caps device pixel
 * ratio, thins out on small screens and draws one still frame under
 * prefers-reduced-motion.
 */

type Props = { className?: string };

const TAU = Math.PI * 2;
const ARMS = 4;
const PALETTE = ["#ffe9c4", "#ffd29a", "#cfe0ff", "#9fc2ff", "#ffc2e0", "#ffffff"];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export default function Galaxy({ className }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    if (!host || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const random = rng(20261003);

    let W = 0;
    let H = 0;
    let dpr = 1;
    let R = 0; // galaxy radius in css px
    let cx = 0;
    let cy = 0;

    /* ---------------- stars ---------------- */
    let N = 0;
    let rad: Float32Array; // normalised radius 0..1
    let ang0: Float32Array; // base angle
    let size: Float32Array;
    let bright: Float32Array;
    let ci: Uint8Array; // palette index
    let lift: Float32Array; // vertical scatter (thickness)
    let bgX: Float32Array;
    let bgY: Float32Array;
    let bgP: Float32Array;
    let bgS: Float32Array;
    const BG = 260;

    const build = () => {
      N = W < 700 ? 2400 : W < 1100 ? 3800 : 5600;
      rad = new Float32Array(N);
      ang0 = new Float32Array(N);
      size = new Float32Array(N);
      bright = new Float32Array(N);
      ci = new Uint8Array(N);
      lift = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const bulge = random() < 0.2;
        let r: number;
        let a: number;
        if (bulge) {
          r = Math.pow(random(), 2.2) * 0.22;
          a = random() * TAU;
        } else {
          r = 0.06 + Math.pow(random(), 0.85) * 0.94;
          const arm = Math.floor(random() * ARMS);
          const spread = (0.5 - Math.pow(random(), 1.4) * 0.5) * (random() < 0.5 ? 1 : -1);
          a = (arm / ARMS) * TAU + Math.log(r * 9 + 1) * 2.4 + spread * (0.55 + r * 0.7);
        }
        rad[i] = r;
        ang0[i] = a;
        size[i] = 0.55 + Math.pow(random(), 5) * 1.9;
        bright[i] = 0.5 + random() * 0.5;
        const warm = r < 0.28 ? 0.8 : 0.18;
        ci[i] = random() < warm ? (random() < 0.5 ? 0 : 1) : random() < 0.12 ? 4 : random() < 0.55 ? 2 : random() < 0.7 ? 3 : 5;
        lift[i] = (random() - 0.5) * (0.06 + (1 - r) * 0.1);
      }
      bgX = new Float32Array(BG);
      bgY = new Float32Array(BG);
      bgP = new Float32Array(BG);
      bgS = new Float32Array(BG);
      for (let i = 0; i < BG; i++) {
        bgX[i] = random();
        bgY[i] = random();
        bgP[i] = random() * TAU;
        bgS[i] = 0.4 + random() * 1.1;
      }
    };

    /* ---------------- nebula texture (drawn once per resize) ---------------- */
    let neb: HTMLCanvasElement | null = null;
    const buildNebula = () => {
      const S = 900;
      const o = document.createElement("canvas");
      o.width = S;
      o.height = S;
      const g = o.getContext("2d");
      if (!g) return;
      const c = S / 2;
      const rr = rng(77);
      g.globalCompositeOperation = "lighter";
      for (let i = 0; i < 320; i++) {
        const arm = i % ARMS;
        const r = 0.08 + rr() * 0.92;
        const a = (arm / ARMS) * TAU + Math.log(r * 9 + 1) * 2.4 + (rr() - 0.5) * (0.5 + r * 0.6);
        const x = c + Math.cos(a) * r * c * 0.92;
        const y = c + Math.sin(a) * r * c * 0.92;
        const rad = 28 + rr() * 70 * (0.5 + r);
        const warm = r < 0.35;
        const col = warm ? "255,205,150" : rr() < 0.7 ? "120,160,255" : "255,150,210";
        const grad = g.createRadialGradient(x, y, 0, x, y, rad);
        grad.addColorStop(0, `rgba(${col},${warm ? 0.1 : 0.075})`);
        grad.addColorStop(1, `rgba(${col},0)`);
        g.fillStyle = grad;
        g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
      const core = g.createRadialGradient(c, c, 0, c, c, c * 0.42);
      core.addColorStop(0, "rgba(255,236,205,0.95)");
      core.addColorStop(0.18, "rgba(255,205,150,0.5)");
      core.addColorStop(0.5, "rgba(255,170,110,0.14)");
      core.addColorStop(1, "rgba(255,150,100,0)");
      g.fillStyle = core;
      g.fillRect(0, 0, S, S);
      // dust lanes: carve soft dark blobs just inside the arms
      g.globalCompositeOperation = "destination-out";
      for (let i = 0; i < 220; i++) {
        const arm = i % ARMS;
        const r = 0.3 + rr() * 0.62;
        const a = (arm / ARMS) * TAU + Math.log(r * 9 + 1) * 2.4 + 0.2 + (rr() - 0.5) * 0.25;
        const x = c + Math.cos(a) * r * c * 0.92;
        const y = c + Math.sin(a) * r * c * 0.92;
        const rad = 14 + rr() * 34;
        const grad = g.createRadialGradient(x, y, 0, x, y, rad);
        grad.addColorStop(0, "rgba(0,0,0,0.5)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = grad;
        g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
      neb = o;
    };

    /* ---------------- sizing ---------------- */
    const resize = () => {
      const r = host.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2);
      cv.width = Math.floor(W * dpr);
      cv.height = Math.floor(H * dpr);
      const wide = W >= 1024;
      cx = W * (wide ? 0.68 : 0.5);
      cy = H * (wide ? 0.4 : 0.3);
      R = Math.min(wide ? W * 0.46 : W * 0.95, H * (wide ? 0.58 : 0.45));
      build();
      buildNebula();
    };

    /* ---------------- interaction state ---------------- */
    let px = 0.5;
    let py = 0.5;
    let tx = 0.5;
    let ty = 0.5;
    let rot = 0;
    let vel = 0.00012; // rad per ms (idle spin)
    let dragging = false;
    let lastX = 0;
    let lastT = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    const pulses: { x: number; y: number; t0: number }[] = [];
    const shooters: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    let nextShooter = 3000;

    const local = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      tx = p.x / p.w;
      ty = p.y / p.h;
      mouseX = p.x;
      mouseY = p.y;
      if (dragging) {
        const now = performance.now();
        const dx = p.x - lastX;
        rot += dx * 0.004;
        vel = (dx * 0.004) / Math.max(8, now - lastT);
        lastX = p.x;
        lastT = now;
      }
    };
    const interactive = (t: EventTarget | null) => t instanceof Element && !!t.closest("a, button, input, textarea, select, [data-no-galaxy]");
    const onDown = (e: PointerEvent) => {
      if (interactive(e.target)) return;
      const p = local(e);
      dragging = true;
      lastX = p.x;
      lastT = performance.now();
      pulses.push({ x: p.x, y: p.y, t0: performance.now() });
      if (pulses.length > 3) pulses.shift();
      host.style.cursor = "grabbing";
    };
    const onUp = () => {
      dragging = false;
      host.style.cursor = "";
    };
    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      tx = 0.5;
      ty = 0.5;
    };

    /* ---------------- frame ---------------- */
    let running = false;
    let raf = 0;
    let t = 0;
    let lastFrame = 0;

    const draw = (now: number, still = false) => {
      const dt = lastFrame ? Math.min(48, now - lastFrame) : 16;
      lastFrame = now;
      t = now;

      if (!still) {
        px += (tx - px) * 0.05;
        py += (ty - py) * 0.05;
        if (!dragging) vel += (0.00012 - vel) * 0.02;
        rot += vel * dt;
      }

      const scroll = Math.min(1, window.scrollY / Math.max(1, H));
      const zoom = 1 + scroll * 0.55;
      const fade = 1 - scroll * 0.9;
      const tilt = 0.5 + (py - 0.5) * 0.28; // flatten factor (cos of inclination)
      const roll = (px - 0.5) * 0.35 - 0.38; // in-plane roll of the whole disc
      const ox = cx + (px - 0.5) * -30;
      const oy = cy + (py - 0.5) * -18;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // deep-space backdrop
      const bg = ctx.createRadialGradient(ox, oy, 0, ox, oy, Math.max(W, H) * 0.8);
      bg.addColorStop(0, "#0b0f22");
      bg.addColorStop(0.45, "#05071a");
      bg.addColorStop(1, "#02030a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // background stars
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "#cfdcff";
      for (let i = 0; i < BG; i++) {
        const tw = still ? 0.7 : 0.45 + 0.55 * Math.sin(t * 0.0013 * bgS[i] + bgP[i]);
        ctx.globalAlpha = 0.5 * tw * fade;
        const sx = bgX[i] * W + (px - 0.5) * -10 * bgS[i];
        const sy = bgY[i] * H + (py - 0.5) * -6 * bgS[i];
        ctx.fillRect(sx, sy, bgS[i], bgS[i]);
      }

      // nebula (rotated, flattened)
      if (neb) {
        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate(roll);
        ctx.scale(zoom, zoom * tilt);
        ctx.rotate(rot);
        ctx.globalAlpha = 0.95 * fade;
        const s = R * 2.05;
        ctx.drawImage(neb, -s / 2, -s / 2, s, s);
        ctx.restore();
      }

      // stars, batched by colour
      const cr = Math.cos(roll);
      const sr = Math.sin(roll);
      const mxs = mouseX;
      const mys = mouseY;
      const now2 = performance.now();
      for (let p = pulses.length - 1; p >= 0; p--) if (now2 - pulses[p].t0 > 1600) pulses.splice(p, 1);

      for (let pass = 0; pass < PALETTE.length; pass++) {
        ctx.fillStyle = PALETTE[pass];
        for (let i = 0; i < N; i++) {
          if (ci[i] !== pass) continue;
          const r = rad[i];
          // differential rotation: inner stars orbit faster
          const a = ang0[i] + rot * (1.8 - r * 1.2);
          const gx = Math.cos(a) * r * R * zoom;
          const gy = Math.sin(a) * r * R * zoom * tilt + lift[i] * R * zoom;
          // roll the disc
          const rx = gx * cr - gy * sr;
          const ry = gx * sr + gy * cr;
          let sx = ox + rx;
          let sy = oy + ry;

          let boost = 1;
          if (mxs > -999) {
            const dx = sx - mxs;
            const dy = sy - mys;
            const d2 = dx * dx + dy * dy;
            if (d2 < 22000) {
              const f = 1 - d2 / 22000;
              boost += f * 1.6;
              const push = f * 6;
              const inv = 1 / (Math.sqrt(d2) + 0.001);
              sx += dx * inv * push;
              sy += dy * inv * push;
            }
          }
          for (let q = 0; q < pulses.length; q++) {
            const pu = pulses[q];
            const age = (now2 - pu.t0) / 1600;
            const ringR = age * R * 1.5;
            const dx = sx - pu.x;
            const dy = sy - pu.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            const band = 46;
            const off = d - ringR;
            if (off > -band && off < band) {
              const f = (1 - Math.abs(off) / band) * (1 - age);
              boost += f * 2.2;
              const push = f * 14;
              sx += (dx / (d + 0.001)) * push;
              sy += (dy / (d + 0.001)) * push;
            }
          }

          const tw = still ? 1 : 0.8 + 0.2 * Math.sin(t * 0.002 + i);
          ctx.globalAlpha = Math.min(1, bright[i] * tw * boost) * fade * (r < 0.2 ? 0.9 : 1);
          const sz = size[i] * (boost > 1.3 ? 1.5 : 1) * (0.9 + zoom * 0.1);
          ctx.fillRect(sx, sy, sz, sz);
        }
      }

      // shooting stars
      if (!still) {
        if (now > nextShooter && W > 600) {
          const fromLeft = Math.random() < 0.5;
          shooters.push({ x: fromLeft ? Math.random() * W * 0.4 : W * (0.6 + Math.random() * 0.4), y: Math.random() * H * 0.35, vx: (fromLeft ? 1 : -1) * (5 + Math.random() * 3), vy: 2 + Math.random() * 2, life: 1 });
          nextShooter = now + 4500 + Math.random() * 6000;
        }
        ctx.globalAlpha = 1;
        for (let s = shooters.length - 1; s >= 0; s--) {
          const sh = shooters[s];
          sh.x += sh.vx;
          sh.y += sh.vy;
          sh.life -= 0.018;
          if (sh.life <= 0) {
            shooters.splice(s, 1);
            continue;
          }
          const g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 9, sh.y - sh.vy * 9);
          g.addColorStop(0, `rgba(255,255,255,${0.9 * sh.life})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(sh.x, sh.y);
          ctx.lineTo(sh.x - sh.vx * 9, sh.y - sh.vy * 9);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      if (!running) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      lastFrame = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    if (reduced) {
      draw(performance.now(), true);
    }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(host);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(performance.now(), true);
    });
    ro.observe(host);

    const surface = host.parentElement ?? host;
    if (!reduced) {
      if (!coarse) surface.addEventListener("pointermove", onMove);
      surface.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      surface.addEventListener("pointerleave", onLeave);
      if (coarse) surface.addEventListener("pointermove", onMove);
    }
    const onVis = () => (document.hidden ? stop() : host.getBoundingClientRect().bottom > 0 && start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      surface.removeEventListener("pointermove", onMove);
      surface.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      surface.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden="true" className={className}>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
