import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

/* ---------- LRC 解析 ---------- */
function parseLRC(text) {
  const out = [];
  text.split(/\r?\n/).forEach((line) => {
    const m = line.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
    if (m) out.push({ t: Number(m[1]) * 60 + Number(m[2]), text: (m[3] || '').trim() || '♪' });
  });
  return out.sort((a, b) => a.t - b.t);
}

/* ---------- 图片采样 → 粒子（5000~10000） ---------- */
function sampleImage(url, target = 8000) {
  return new Promise((resolve) => {
    const img = new Image(); img.crossOrigin = 'anonymous';
    img.onload = () => {
      const S = 128;
      const off = document.createElement('canvas'); off.width = off.height = S;
      const o = off.getContext('2d', { willReadFrequently: true });
      o.drawImage(img, 0, 0, S, S);
      const px = o.getImageData(0, 0, S, S).data;
      const raw = [];
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const k = (y * S + x) * 4;
        if (px[k + 3] < 50) continue;
        raw.push({ x: x / S - .5, y: -(y / S - .5), r: px[k] / 255, g: px[k + 1] / 255, b: px[k + 2] / 255 });
      }
      const step = Math.max(1, Math.floor(raw.length / target));
      const pts = raw.filter((_, i) => i % step === 0).slice(0, 10000);
      resolve(pts.length ? pts : Array.from({ length: 4000 }).map(() => ({ x: Math.random() - .5, y: Math.random() - .5, r: .55, g: .9, b: 1 })));
    };
    img.onerror = () => resolve(Array.from({ length: 4000 }).map(() => ({ x: Math.random() - .5, y: Math.random() - .5, r: .55, g: .9, b: 1 })));
    img.src = url;
  });
}

const glowTex = () => {
  const c = document.createElement('canvas'); c.width = c.height = 32;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.4, 'rgba(255,255,255,.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
};

export default function NightVisualPlayer({ audioUrl, coverUrl, title }) {
  const mount = useRef(null);
  const audioRef = useRef(null);
  const imgRef = useRef(null);
  const lrcRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(.8);
  const [lyrics, setLyrics] = useState([]);
  const [activeLine, setActiveLine] = useState(-1);
  const [strength, setStrength] = useState(1);
  const [pCount, setPCount] = useState(0);
  const api = useRef({ base: [], freq: new Uint8Array(128), analyser: null, ctx: null, ready: false });

  const fmt = (t) => (!t || Number.isNaN(t) ? '00:00' : `${Math.floor(t / 60).toString().padStart(2, '0')}:${Math.floor(t % 60).toString().padStart(2, '0')}`);

  /* ---------- Three 场景 ---------- */
  useEffect(() => {
    const el = mount.current; if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, .1, 50);
    camera.position.z = 2.6;
    const group = new THREE.Group(); scene.add(group);
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.PointsMaterial({ size: .02, map: glowTex(), vertexColors: true, transparent: true, opacity: .95, depthWrite: false, blending: THREE.AdditiveBlending });
    group.add(new THREE.Points(geo, mat));
    let drag = null;
    const dn = (e) => { drag = { x: e.clientX, y: e.clientY }; };
    const mv = (e) => { if (!drag) return; group.rotation.y += (e.clientX - drag.x) * .008; group.rotation.x += (e.clientY - drag.y) * .005; drag = { x: e.clientX, y: e.clientY }; };
    const up = () => { drag = null; };
    renderer.domElement.addEventListener('pointerdown', dn);
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);

    let t = 0, raf = 0, rot = 0;
    const loop = () => {
      t += .016;
      const A = api.current;
      const F = A.freq;
      let low = 0, mid = 0, high = 0;
      if (A.ready && F.length) {
        for (let i = 0; i < 10; i++) low += F[i];
        for (let i = 10; i < 40; i++) mid += F[i];
        for (let i = 40; i < 128; i++) high += F[i];
        low /= 10 * 255; mid /= 30 * 255; high /= 88 * 255;
        A.analyser.getByteFrequencyData(F);
      }
      const breathe = 1 + low * .55 * strength;                       // 低频→呼吸/膨胀
      rot += (.002 + mid * .05 * strength);                           // 中频→旋转速度
      group.rotation.y += .0015; group.rotation.z = rot * .15;
      group.scale.setScalar(breathe);
      const pos = geo.attributes.position?.array, col = geo.attributes.color?.array;
      if (pos && A.base.length) {
        const B = A.base;
        for (let i = 0; i < B.length; i++) {
          const p = B[i];
          const flick = high > .02 && Math.random() < high * .35       // 高频→闪烁
            ? (Math.random() - .5) * .12 * strength : 0;
          pos[i * 3] = p.x * 2 + Math.sin(t * 1.6 + i * .7) * .008 * strength + flick;
          pos[i * 3 + 1] = p.y * 2 + Math.cos(t * 1.4 + i) * .008 * strength + flick * .6;
          pos[i * 3 + 2] = (p.z || 0) + Math.sin(t + i * 1.3) * .05 * strength * (0.4 + low);
          const tw = high > .02 ? 1 - Math.random() * high * .8 : 1;   // 高频透明感→亮度抖动
          col[i * 3] = p.r * tw; col[i * 3 + 1] = p.g * tw; col[i * 3 + 2] = p.b * tw;
        }
        geo.attributes.position.needsUpdate = true;                    // 只在变化时更新
        geo.attributes.color.needsUpdate = true;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();
    const rs = () => { renderer.setSize(el.clientWidth, el.clientHeight); camera.aspect = el.clientWidth / el.clientHeight; camera.updateProjectionMatrix(); };
    window.addEventListener('resize', rs);
    api.current._geo = geo;
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', rs); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); renderer.dispose(); el.innerHTML = ''; };
  }, []);

  const pushParticles = useCallback((pts) => {
    const withZ = pts.map((p) => ({ ...p, z: (Math.random() - .5) * .6 }));
    api.current.base = withZ;
    setPCount(withZ.length);
    const geo = api.current._geo; if (!geo) return;
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(withZ.length * 3), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(withZ.length * 3), 3));
  }, []);

  useEffect(() => { sampleImage(coverUrl).then(pushParticles); }, [coverUrl, pushParticles]);

  /* ---------- AudioContext + Analyser ---------- */
  const ensureAudio = () => {
    const A = api.current, a = audioRef.current;
    if (A.ready || !a) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const src = ctx.createMediaElementSource(a);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;                                            // → 128 频点
    analyser.smoothingTimeConstant = .8;
    src.connect(analyser); analyser.connect(ctx.destination);
    A.ctx = ctx; A.analyser = analyser; A.freq = new Uint8Array(analyser.frequencyBinCount); A.ready = true;
  };
  const toggle = () => {
    const a = audioRef.current; if (!a) return;
    ensureAudio(); api.current.ctx?.resume();
    if (playing) { a.pause(); setPlaying(false); } else { a.play().catch(() => {}); setPlaying(true); }
  };

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const tu = () => {
      setCur(a.currentTime);
      if (lyrics.length) {
        let k = -1;
        for (let i = 0; i < lyrics.length; i++) if (a.currentTime >= lyrics[i].t) k = i;
        setActiveLine(k);
        document.getElementById(`lrc-${k}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    };
    const lm = () => setDur(a.duration || 0);
    const le = () => setPlaying(false);
    a.addEventListener('timeupdate', tu); a.addEventListener('loadedmetadata', lm); a.addEventListener('ended', le);
    return () => { a.removeEventListener('timeupdate', tu); a.removeEventListener('loadedmetadata', lm); a.removeEventListener('ended', le); };
  }, [lyrics, audioUrl]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = vol; }, [vol]);

  return (
    <div className="flex min-h-screen flex-col bg-[#04070f] font-['VT323'] text-white">
      {/* 顶部上传区 */}
      <div className="mx-auto flex w-full max-w-3xl flex-wrap gap-2 px-4 pt-4">
        <button onClick={() => imgRef.current?.click()} className="flex-1 rounded-xl border-[3px] border-dashed border-[#8be9fd] bg-white/5 px-4 py-3 text-left text-2xl hover:bg-white/10">
          🖼 点击 / 拖拽上传图片转粒子 <span className="text-cyan-300">({pCount} pts)</span>
        </button>
        <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) sampleImage(URL.createObjectURL(f)).then(pushParticles); e.target.value = null; }} />
        <button onClick={() => lrcRef.current?.click()} className="rounded-xl border-[3px] border-[#ffe45e] bg-white/5 px-4 py-3 text-2xl hover:bg-white/10">🎵 传.lrc歌词</button>
        <input ref={lrcRef} type="file" accept=".lrc" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = () => setLyrics(parseLRC(String(r.result))); r.readAsText(f); } e.target.value = null; }} />
        <label className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 text-xl">强度
          <input type="range" min="0" max="2" step=".1" value={strength} onChange={(e) => setStrength(Number(e.target.value))} className="w-24" />
        </label>
      </div>

      {/* 中间粒子主体 */}
      <div className="mx-auto mt-3 w-full max-w-3xl flex-1 px-4">
        <div ref={mount} className="h-[46vh] cursor-grab overflow-hidden rounded-2xl border border-white/15 bg-black/50 active:cursor-grabbing"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) sampleImage(URL.createObjectURL(f)).then(pushParticles); }} />
        <p className="mt-1 text-center text-xl text-cyan-200/60">拖拽旋转 · 低频呼吸 · 中频旋转 · 高频闪烁</p>
      </div>

      {/* 歌词区：正格点黑 16px，当前行高亮 */}
      <div className="mx-auto mt-2 max-h-36 w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-white/5 px-4 py-2" style={{ fontFamily: "'Zpix','DotGothic16',monospace", fontSize: 16 }}>
        {lyrics.length ? lyrics.map((l, i) => (
          <p key={i} id={`lrc-${i}`} className={`py-0.5 transition ${i === activeLine ? 'scale-[1.02] text-[#ffe45e]' : 'text-white/45'}`}>
            {i === activeLine ? '▶ ' : ''}{l.text}
          </p>
        )) : <p className="py-3 text-center text-white/40">上传 .lrc 文件，歌词将在此滚动高亮</p>}
      </div>

      {/* 底部控制栏：像素复古风 */}
      <div className="mx-auto mb-5 mt-3 w-full max-w-3xl px-4">
        <div className="rounded-2xl border-[3px] border-[#8be9fd] bg-[#0d1440]/90 p-3 shadow-[5px_5px_0_rgba(139,233,253,.25)]">
          <div className="flex items-center gap-3 text-2xl">
            <span className="w-14 text-right">{fmt(cur)}</span>
            <input type="range" min="0" max={dur || 0} step=".1" value={cur} onChange={(e) => { audioRef.current.currentTime = Number(e.target.value); setCur(Number(e.target.value)); }} className="flex-1" />
            <span className="w-14">{fmt(dur)}</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <button onClick={toggle} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-black">{playing ? '❚❚' : '▶'}</button>
            <span className="max-w-40 truncate text-2xl">{title}</span>
            <label className="ml-auto flex items-center gap-2 text-2xl">🔊
              <input type="range" min="0" max="1" step=".05" value={vol} onChange={(e) => setVol(Number(e.target.value))} className="w-24" />
            </label>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={audioUrl} preload="metadata" crossOrigin="anonymous" />
    </div>
  );
}
