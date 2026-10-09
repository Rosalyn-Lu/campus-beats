import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm';

// 从封面采样粒子位置+颜色
function sampleCover(url, n = 6000) {
  return new Promise((resolve) => {
    const img = new Image(); img.crossOrigin = 'anonymous';
    img.onload = () => {
      const S = 120, off = document.createElement('canvas'); off.width = off.height = S;
      const o = off.getContext('2d', { willReadFrequently: true }); o.drawImage(img, 0, 0, S, S);
      const px = o.getImageData(0, 0, S, S).data;
      const pts = [];
      for (let y = 0; y < S && pts.length < n * 2; y++) for (let x = 0; x < S && pts.length < n * 2; x++) {
        const k = (y * S + x) * 4;
        if (px[k + 3] < 40) continue;
        if (Math.random() > 0.55) continue;
        pts.push({ x: (x / S - .5) * 2, y: -(y / S - .5) * 2, z: (Math.random() - .5) * .5, r: px[k] / 255, g: px[k + 1] / 255, b: px[k + 2] / 255 });
      }
      resolve(pts.slice(0, n));
    };
    img.onerror = () => resolve(Array.from({ length: 2500 }).map(() => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() - .5, r: .55, g: .91, b: .99 })));
    img.src = url;
  });
}

export default function GestureParticles({ covers, activeUrl }) {
  const mount = useRef(null); const video = useRef(null);
  const [cover, setCover] = useState(activeUrl);
  const [tint, setTint] = useState('#8be9fd');
  const [useTint, setUseTint] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [spread, setSpread] = useState(1);
  const [hands, setHands] = useState(0);
  const [fs, setFs] = useState(false);
  const state = useRef({ spread: 1, target: 1, rotY: 0, rotX: .2 });
  const tintRef = useRef(tint); tintRef.current = tint;
  const useTintRef = useRef(useTint); useTintRef.current = useTint;
  const coverRef = useRef(cover); coverRef.current = cover;

  // --- Three 场景 ---
  useEffect(() => {
    const el = mount.current; if (!el) return;
    const W = () => el.clientWidth, H = () => el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W(), H()); el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W() / H(), .1, 50); camera.position.z = 3.4;
    const group = new THREE.Group(); scene.add(group);
    const geo = new THREE.BufferGeometry();
    let mat;
    const tex = (() => { const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d'); const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.4, 'rgba(255,255,255,.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return new THREE.CanvasTexture(c); })();

    let alive = true, base = [];
    const load = async (url) => {
      base = await sampleCover(url);
      if (!alive) return;
      const n = base.length;
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      if (!mat) {
        mat = new THREE.PointsMaterial({ size: .022, map: tex, vertexColors: true, transparent: true, opacity: .95, depthWrite: false, blending: THREE.AdditiveBlending });
        group.add(new THREE.Points(geo, mat));
      }
      const col = geo.attributes.color.array;
      base.forEach((p, i) => { col[i * 3] = p.r; col[i * 3 + 1] = p.g; col[i * 3 + 2] = p.b; });
      geo.attributes.color.needsUpdate = true;
    };
    load(coverRef.current);
    const id = setInterval(() => { if (coverRef.current !== load._u) { load._u = coverRef.current; load(coverRef.current); } }, 400);

    // 拖拽旋转
    let drag = null;
    const dn = (e) => { drag = { x: e.clientX, y: e.clientY }; };
    const mv = (e) => { if (!drag) return; state.current.rotY += (e.clientX - drag.x) * .008; state.current.rotX += (e.clientY - drag.y) * .005; drag = { x: e.clientX, y: e.clientY }; };
    const up = () => { drag = null; };
    renderer.domElement.addEventListener('pointerdown', dn);
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);

    const tintC = new THREE.Color();
    let t = 0, raf = 0;
    const loop = () => {
      t += .016;
      const s = state.current;
      s.spread += (s.target - s.spread) * .08; // 手势实时插值
      s.rotY += .003;
      group.rotation.y = s.rotY; group.rotation.x = s.rotX;
      group.scale.setScalar(s.spread);
      const pos = geo.attributes.position?.array, col = geo.attributes.color?.array;
      if (pos && base.length) {
        tintC.set(tintRef.current);
        for (let i = 0; i < base.length; i++) {
          const p = base[i], w = Math.sin(t * 2 + i) * .02 * s.spread;
          pos[i * 3] = p.x * (1 + (s.spread - 1) * .9); pos[i * 3 + 1] = p.y * (1 + (s.spread - 1) * .9) + w; pos[i * 3 + 2] = p.z * s.spread;
          if (useTintRef.current) { col[i * 3] = tintC.r; col[i * 3 + 1] = tintC.g; col[i * 3 + 2] = tintC.b; }
          else { col[i * 3] = p.r; col[i * 3 + 1] = p.g; col[i * 3 + 2] = p.b; }
        }
        geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();
    const rs = () => { renderer.setSize(W(), H()); camera.aspect = W() / H(); camera.updateProjectionMatrix(); };
    window.addEventListener('resize', rs);
    return () => { alive = false; clearInterval(id); cancelAnimationFrame(raf); window.removeEventListener('resize', rs); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); renderer.dispose(); el.innerHTML = ''; };
  }, []);

  // --- 摄像头 + 双手张合检测 ---
  useEffect(() => {
    if (!camOn) return;
    let stop = false, raf = 0, lm = null, stream = null;
    (async () => {
      try {
        const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
        const fileset = await FilesetResolver.forVisionTasks(WASM);
        lm = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', delegate: 'GPU' },
          runningMode: 'VIDEO', numHands: 2,
        });
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (stop) { stream.getTracks().forEach((t) => t.stop()); return; }
        video.current.srcObject = stream;
        await video.current.play();
        const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
        const tick = () => {
          if (stop || !video.current || video.current.readyState < 2) { raf = requestAnimationFrame(tick); return; }
          const res = lm.detectForVideo(video.current, performance.now());
          const hs = res.landmarks || [];
          setHands(hs.length);
          if (hs.length >= 2) {
            // 双手腕距离 -> 缩放/扩散
            const gap = dist(hs[0][0], hs[1][0]);
            state.current.target = Math.min(2.4, Math.max(.55, gap * 3.2));
          } else if (hs.length === 1) {
            // 单手拇指-食指开合
            const pinch = dist(hs[0][4], hs[0][8]);
            state.current.target = Math.min(2.4, Math.max(.55, .5 + pinch * 3.4));
          }
          setSpread(Number(state.current.target.toFixed(2)));
          raf = requestAnimationFrame(tick);
        };
        tick();
      } catch { setCamOn(false); }
    })();
    return () => { stop = true; cancelAnimationFrame(raf); stream?.getTracks().forEach((t) => t.stop()); lm?.close(); };
  }, [camOn]);

  const full = () => {
    const el = mount.current?.parentElement;
    if (!el) return;
    if (document.fullscreenElement) { document.exitFullscreen(); setFs(false); }
    else { el.requestFullscreen?.(); setFs(true); }
  };

  return (
    <div className="relative">
      <div ref={mount} className="h-[46vh] w-full cursor-grab overflow-hidden rounded-2xl border border-white/15 bg-black/40 active:cursor-grabbing" />
      {/* 简洁现代控制面板 */}
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur">
        <button onClick={() => setCamOn((v) => !v)} className={`rounded-full px-4 py-1.5 text-lg font-bold ${camOn ? 'bg-emerald-400 text-black' : 'bg-white/10'}`}>
          {camOn ? `● 手势中 ${hands}手 · ×${spread}` : '○ 开启手势'}
        </button>
        <label className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-lg">
          <input type="color" value={tint} onChange={(e) => setTint(e.target.value)} className="h-6 w-8 cursor-pointer bg-transparent" />
          粒子色
        </label>
        <button onClick={() => setUseTint((v) => !v)} className="rounded-full bg-white/10 px-3 py-1.5 text-lg">{useTint ? '用所选色' : '用封面色'}</button>
        <button onClick={full} className="ml-auto rounded-full bg-white/10 px-4 py-1.5 text-lg">{fs ? '⤢ 退出全屏' : '⤢ 全屏'}</button>
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {covers.map((c) => (
          <button key={c.id} onClick={() => { setCover(c.cover); }} className={`shrink-0 overflow-hidden rounded-xl border-2 ${cover === c.cover ? 'border-cyan-300' : 'border-white/15'}`}>
            <img src={c.cover} alt={c.title} className="h-12 w-12 object-cover" />
          </button>
        ))}
      </div>
      <video ref={video} playsInline muted className={`absolute right-2 top-2 w-24 rounded-lg border border-white/30 ${camOn ? '' : 'hidden'}`} />
    </div>
  );
}
