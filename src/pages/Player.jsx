import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRadio } from '../context/RadioContext';
import { Play, Pause, ChevronDown, Heart, Moon, Sun, SkipBack, SkipForward, Camera, Palette, RotateCcw } from 'lucide-react';
import { FONTS } from '../theme';
import NightVisualPlayer from '../components/NightVisualPlayer';

function WalkmanDisc({ spin }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-full border-2 border-[#3a3f4a]"
      style={{ background: 'radial-gradient(circle at 50% 38%, #2c3a6e 0%, #101426 55%, #05060d 100%)', animation: spin ? 'spinDisc 8s linear infinite' : undefined }}>
      <div className="absolute inset-0 rounded-full" style={{ background: 'repeating-radial-gradient(circle at 50% 50%, transparent 0 12px, rgba(255,255,255,.07) 12px 13px)' }} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 120 120" shapeRendering="crispEdges">
        <rect x="18" y="24" width="6" height="6" fill="#ffe45e" /><rect x="20" y="22" width="2" height="10" fill="#ffe45e" /><rect x="16" y="26" width="10" height="2" fill="#ffe45e" />
        <rect x="92" y="72" width="5" height="5" fill="#8be9fd" />
        <rect x="88" y="28" width="10" height="6" fill="#7ee787" /><rect x="90" y="32" width="6" height="2" fill="#0b1e2e" />
        <text x="60" y="104" textAnchor="middle" fontSize="7" fill="#ffe45e" fontFamily="'DotGothic16',monospace" letterSpacing="1.5">CHIM.POP ROCKS</text>
      </svg>
    </div>
  );
}
/* 深夜场左下：黑红星星光盘（星星/闪电/月亮/Y2K） */
function StarRedCD({ spin }) {
  return (
    <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full border-[3px] border-[#8be9fd] shadow-[4px_4px_0_rgba(139,233,253,.35)] md:h-44 md:w-44"
      style={{ background: 'radial-gradient(circle at 50% 40%, #1a1a22 0%, #050508 65%)', animation: spin ? 'spinDisc 10s linear infinite' : undefined }}>
      <div className="absolute inset-0 rounded-full" style={{ background: 'repeating-radial-gradient(circle at 50% 50%, transparent 0 9px, rgba(255,255,255,.05) 9px 10px)' }} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" shapeRendering="crispEdges">
        <g fill="none" stroke="#e8ecf4" strokeWidth="1.6" opacity=".9">
          <path d="M50 12l4.5 9.5 10.5 1.2-7.7 7.1 2 10.3L50 35l-9.3 5.1 2-10.3-7.7-7.1 10.5-1.2z" />
          <path d="M22 30l2.6 5.4 6 0.7-4.4 4 1.2 5.9L22 43l-5.4 3 1.2-5.9-4.4-4 6-0.7z" />
          <path d="M80 34l2.6 5.4 6 0.7-4.4 4 1.2 5.9-5.4-3-5.4 3 1.2-5.9-4.4-4 6-0.7z" />
          <path d="M30 62l5 10.5 11.5 1.4-8.4 7.8 2.2 11.3L30 87.5l-10.3 5.5 2.2-11.3-8.4-7.8 11.5-1.4z" />
          <path d="M72 60l4 8.5 9.2 1.1-6.7 6.2 1.8 9.1L72 80.4l-8.3 4.5 1.8-9.1-6.7-6.2 9.2-1.1z" />
          <path d="M50 84l2.2 4.6 5 0.6-3.7 3.4 1 5L50 95l-4.5 2.6 1-5-3.7-3.4 5-0.6z" />
        </g>
        <path d="M14 20l3 6 6.5 1-4.7 4.5 1.2 6.5-6-3.2-6 3.2 1.2-6.5-4.7-4.5 6.5-1z" fill="#ff5d5d" opacity=".9" />
        <path d="M84 14l1.8 1v4l-2.6 1.6 1 2.8-2.8-1-2.8 1 1-2.8-2.6-1.6v-4l1.8-1 1.6-2.4z" fill="#8be9fd" opacity=".9" />
        <path d="M16 66q4-1 5-5 1 4 5 5-4 1-5 5-1-4-5-5z" fill="#ffe45e" />
        <text x="78" y="88" textAnchor="middle" fontSize="6" fill="#8be9fd" fontFamily="'DotGothic16',monospace">Y2K</text>
      </svg>
      <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-[#e03434] shadow-[0_0_14px_rgba(224,52,52,.7)]" />
      <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
    </div>
  );
}
/* 图一粉色 TeddyBear 光盘 */
function TeddyCD({ spin }) {
  return (
    <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full border-[3px] border-[#2b1a4e] shadow-[4px_4px_0_#2b1a4e] md:h-44 md:w-44"
      style={{ background: 'conic-gradient(from 20deg,#f9d3e3,#f2a9c8,#f9d3e3,#e8b4d0,#f9d3e3)', animation: spin ? 'spinDisc 10s linear infinite' : undefined }}>
      <span className="absolute left-3 top-4 text-xl">🧸</span><span className="absolute right-4 top-3 text-lg">⚡</span>
      <span className="absolute left-5 top-1/2 text-lg">💗</span><span className="absolute right-3 top-1/2 text-lg">🌸</span>
      <span className="absolute bottom-5 left-6 text-lg">🧸</span>
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-['DotGothic16'] text-base text-[#7c4dff]" style={{ textShadow: '1px 1px 0 #fff' }}>Teddy Bear</p>
      <span className="absolute right-5 top-8 rounded-full bg-white px-1.5 font-['VT323'] text-sm">Gift ♥</span>
      <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#2b1a4e] bg-white" />
      <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4f2ec]" />
    </div>
  );
}

const DEMO_LRC = `[00:00.00]♪ 前奏 ♪
[00:05.00]当音乐击中你时
[00:10.00]你不会感到疼痛
[00:15.00]闭上眼睛只用耳朵投票
[00:20.00]星光落在节拍上
[00:25.00]♪ 间奏 ♪`;

function parseLRC(t) { const o = []; t.split(/\r?\n/).forEach((l) => { const m = l.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/); if (m) o.push({ t: +m[1] * 60 + +m[2], x: (m[3] || '').trim() || '♪' }); }); return o.sort((a, b) => a.t - b.t); }

/* 5. 一闪一闪的星星 */
function TwinkleStars({ n = 40 }) {
  const stars = useRef(Array.from({ length: n }).map(() => ({ l: Math.random() * 100, t: Math.random() * 100, s: 8 + Math.random() * 14, d: Math.random() * 2 })));
  return (
    <div className="pointer-events-none absolute inset-0">
      <style>{`@keyframes tw{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:1;transform:scale(1.25)}}`}</style>
      {stars.current.map((s, i) => (
        <span key={i} className="absolute text-white" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, animation: `tw ${1.2 + s.d}s ease-in-out infinite`, animationDelay: `${s.d}s`, textShadow: '0 0 6px #8be9fd,0 0 12px #8be9fd' }}>✦</span>
      ))}
    </div>
  );
}

/* 6. 蝴蝶扇翅 3D 光粒子：canvas 2D 投影 + 拖拽看立体 */
function ButterflyParticles({ playing }) {
  const ref = useRef(null);
  const rot = useRef({ x: 0.3, y: 0 });
  const drag = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, raf = 0, t = 0;
    const fit = () => { const r = cv.parentElement.getBoundingClientRect(); W = cv.width = Math.max(200, r.width); H = cv.height = Math.max(200, r.height); };
    fit(); window.addEventListener('resize', fit);
    // 蝴蝶双翼采样：参数方程翅膀轮廓
    const pts = [];
    for (let i = 0; i < 2200; i++) {
      const side = i % 2 ? 1 : -1;
      const u = Math.random(), v = Math.random();
      const wingW = 0.95 * Math.sin(Math.PI * Math.min(1, u * 1.15));
      const x = side * (0.08 + u * wingW);
      const y = (v - 0.55) * (0.75 - u * 0.35) + (u > 0.7 ? -(u - 0.7) * 1.4 : 0);
      const c = Math.random();
      pts.push({ x, y, z: (Math.random() - 0.5) * 0.25, u, side, col: c < 0.6 ? [235, 245, 255] : c < 0.8 ? [139, 233, 253] : [255, 130, 200], ph: Math.random() * 6.28 });
    }
    const loop = () => {
      t += playing ? 0.05 : 0.015;
      rot.current.y += playing ? 0.008 : 0.003;
      ctx.clearRect(0, 0, W, H);
      const flap = Math.sin(t * 2.2) * 0.55; // 扇翅
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.42;
      const cX = Math.cos(rot.current.x), sX = Math.sin(rot.current.x), cY = Math.cos(rot.current.y), sY = Math.sin(rot.current.y);
      const proj = pts.map((p) => {
        const fold = 1 - Math.abs(flap) * p.u * 0.55;
        let x = p.x * fold, y = p.y, z = p.z + flap * p.u * 0.5 * p.side;
        const y1 = y * cX - z * sX, z1 = y * sX + z * cX;
        const x2 = x * cY + z1 * sY, z2 = -x * cY + z1 * cY;
        return { p, sx: cx + x2 * R, sy: cy + y1 * R, depth: z2 };
      }).sort((a, b) => a.depth - b.depth);
      proj.forEach(({ p, sx, sy, depth }) => {
        const sc = (depth + 1.2) / 2.2, sz = 0.6 + sc * 1.8;
        ctx.globalAlpha = 0.35 + sc * 0.65;
        ctx.fillStyle = `rgb(${p.col[0]},${p.col[1]},${p.col[2]})`;
        ctx.shadowColor = 'rgba(139,233,253,.9)'; ctx.shadowBlur = 7 * sc;
        ctx.fillRect(sx, sy, sz, sz);
      });
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', fit); };
  }, [playing]);
  return (
    <canvas ref={ref} className="h-full w-full cursor-grab active:cursor-grabbing"
      onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if (!drag.current) return; rot.current.y += (e.clientX - drag.current.x) * 0.009; rot.current.x += (e.clientY - drag.current.y) * 0.006; drag.current = { x: e.clientX, y: e.clientY }; }}
      onPointerUp={() => { drag.current = null; }} />
  );
}

export default function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { songs, vote, hasVoted, isDarkMode: d, toggleTheme } = useRadio();
  const song = songs.find((s) => s.id === Number(id));
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [painted, setPainted] = useState(false);
  const [lid, setLid] = useState(0);
  const [lrc, setLrc] = useState(() => parseLRC(DEMO_LRC));
  const [line, setLine] = useState(-1);
  const audioRef = useRef(null);
  const photoRef = useRef(null);
  const lrcRef = useRef(null);
  const analyser = useRef({ an: null, freq: null, ctx: null });
  const voted = song ? hasVoted(song.id) : false;

  const togglePlay = useCallback(() => {
    const a = audioRef.current; if (!a) return;
    if (isPlaying) { a.pause(); setIsPlaying(false); } else { a.play().catch(() => {}); setIsPlaying(true); }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    const up = () => {
      setCurrentTime(audio.currentTime);
      let k = -1; for (let i = 0; i < lrc.length; i++) if (audio.currentTime >= lrc[i].t) k = i;
      setLine(k);
      document.getElementById(`plrc-${k}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };
    const ld = () => setDuration(audio.duration || 0);
    const ed = () => { setIsPlaying(false); setHasFinished(true); };
    audio.addEventListener('timeupdate', up); audio.addEventListener('loadedmetadata', ld); audio.addEventListener('ended', ed);
    audio.play().catch(() => setIsPlaying(false));
    return () => { audio.removeEventListener('timeupdate', up); audio.removeEventListener('loadedmetadata', ld); audio.removeEventListener('ended', ed); };
  }, [id, lrc]);

  // 开盖：鼠标移动 + 音乐能量驱动，无按钮（白天/夜晚共用）
  useEffect(() => {
    let raf = 0, target = 0, mx = 0;
    const onMove = (e) => { mx = e.clientX / window.innerWidth; target = Math.max(target, 0.25 + mx * 0.5); };
    window.addEventListener('pointermove', onMove);
    try {
      const a = audioRef.current;
      if (a && !analyser.current.ctx) {
        const C = window.AudioContext || window.webkitAudioContext;
        const ctx = new C(); const src = ctx.createMediaElementSource(a);
        const an = ctx.createAnalyser(); an.fftSize = 128; src.connect(an); an.connect(ctx.destination);
        analyser.current = { an, freq: new Uint8Array(an.frequencyBinCount), ctx };
      }
    } catch {}
    const t0 = performance.now();
    const tick = (t) => {
      const auto = Math.min(1, Math.max(0, (t - t0 - 2200) / 2000));
      let energy = 0;
      const { an, freq } = analyser.current;
      if (an && isPlaying) { an.getByteFrequencyData(freq); let s = 0; for (let i = 0; i < 8; i++) s += freq[i]; energy = (s / 8 / 255) * 0.35; }
      const goal = Math.min(1, Math.max(auto, target, energy + (isPlaying ? 0.55 : 0.2)));
      setLid((v) => v + (goal - v) * 0.04);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); };
  }, [d, id, isPlaying]);

  const fmt = (t) => (!t || Number.isNaN(t) ? '00:00' : `${Math.floor(t / 60).toString().padStart(2, '0')}:${Math.floor(t % 60).toString().padStart(2, '0')}`);
  const onPhoto = (e) => { const f = e.target.files[0]; if (f) { setPhoto(URL.createObjectURL(f)); setPainted(false); } e.target.value = null; };
  if (!song) return <div className="py-20 text-center">找不到这首歌...</div>;
  const open = lid > 0.15;

  if (d) {
  return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0b1e5b] font-['VT323'] text-white" style={{ imageRendering: 'pixelated' }}>
        <style>{FONTS}</style>
        {/* 霓虹底：深蓝渐变 + 青网格 + 星点 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b1e5b] via-[#3b1d7a] to-[#12082e]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(139,233,253,0.12)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(139,233,253,0.12)_1.5px,transparent_1.5px)] bg-[length:30px_30px]" />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(1.6px 1.6px at 12% 20%, #fff, transparent),radial-gradient(1.6px 1.6px at 70% 10%, #ffe45e, transparent),radial-gradient(2px 2px at 85% 60%, #8be9fd, transparent)' }} />
        <TwinkleStars n={44} />
        <div className="relative z-10 flex items-center justify-between px-5 pt-4">
          <button onClick={() => navigate(-1)} className="rounded-lg border-[3px] border-[#8be9fd] bg-white/10 p-2"><ChevronDown size={20} /></button>
          <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-[#8be9fd]">● Soulmate — {song.title}</p>
          <button onClick={toggleTheme} className="rounded-lg border-[3px] border-[#ffe45e] bg-white/10 p-2 text-[#ffe45e]"><Sun size={18} /></button>
        </div>
        {/* 同款翻盖机身，霓虹配色 — 尺寸与白天场一致 */}
        <div className="relative z-10 mx-auto mt-3 w-[340px] md:w-[430px]" style={{ perspective: '1200px' }}>
          <div className="relative rounded-full border-[3px] border-[#8be9fd] bg-[#241a5e] px-6 pb-8 pt-28 shadow-[8px_10px_0_rgba(139,233,253,.25)]">
            {!open && (
              <div className="absolute left-1/2 top-4 w-60 -translate-x-1/2">
                <div className="border-[3px] border-[#8be9fd] bg-[#151b4d] px-2 py-1.5">
                  <div className="overflow-hidden border-2 border-[#8be9fd] bg-black px-2 py-1">
                    <p className="whitespace-nowrap font-['DotGothic16'] text-base leading-none text-[#8be9fd]" style={{ animation: 'marquee 2.2s linear infinite' }}>MUSIC♪MUSIC♪{song.title}♪</p>
                  </div>
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-3xl">🎧</span>
              </div>
            )}
            <div className="relative mx-auto mt-10" style={{ width: 308, height: 308 }}>
              <WalkmanDisc spin={open && isPlaying} />
              {/* 蝴蝶光粒子：盖在光盘中间，可拖拽看立体 */}
              <div className="absolute inset-0"><ButterflyParticles playing={isPlaying} /></div>
              <button onClick={() => photoRef.current?.click()} className="absolute left-1/2 top-1/2 z-10 h-[172px] w-[172px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[3px] border-[#8be9fd] bg-[#151b4d]/85">
                {photo ? <img src={photo} alt="" className="h-full w-full object-cover" />
                  : <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-cyan-100"><Camera size={32} /><span className="font-['Noto_Sans_SC'] text-sm font-bold">记录此刻</span></span>}
        </button>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </div>
            <p className="mt-3 truncate px-4 text-center font-['Press_Start_2P'] text-[9px] tracking-[.2em] text-[#ffe45e]">♪ {song.title} ♪</p>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0" style={{ transform: `rotateX(${lid * 102}deg)`, transformOrigin: '50% 8%', opacity: lid >= 0.98 ? 0 : 1 }}>
            <div className="rounded-full border-[3px] border-[#8be9fd] bg-[#3b2a86] px-6 pb-12 pt-28">
              <div className="mx-auto border-2 border-dashed border-[#8be9fd]/50 bg-black/20" style={{ width: 268, height: 268, borderRadius: '50%' }} />
            </div>
          </div>
        </div>
        <div className="pointer-events-none fixed bottom-6 left-4 z-20 md:left-8">
          <StarRedCD spin={isPlaying} />
        </div>
        {/* 记录此刻 + 歌词：样式大小与白天场一致（仅换霓虹配色），无外层小播放器 */}
        <div className="relative z-10 mx-auto mt-3 grid w-full max-w-3xl items-start gap-4 px-4 pb-2 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <div className="mx-auto mt-2 flex max-w-md flex-wrap items-center justify-center gap-2">
              <button onClick={() => photoRef.current?.click()} className="flex items-center gap-1 rounded-xl border-[3px] border-[#8be9fd] bg-white/10 px-3 py-1.5 font-['Press_Start_2P'] text-[10px] text-white"><Camera size={14} /> 记录此刻</button>
              <button onClick={() => setPainted((p) => !p)} disabled={!photo} className="flex items-center gap-1 rounded-xl border-[3px] border-[#8be9fd] bg-[#ffe45e] px-3 py-1.5 font-['Press_Start_2P'] text-[10px] text-[#2b1a4e] disabled:opacity-40"><Palette size={14} /> {painted ? '看原图' : '一键如画'}</button>
              {photo && <button onClick={() => { setPhoto(null); setPainted(false); }} className="rounded-xl border-[3px] border-[#8be9fd] bg-white/10 px-2 py-1.5 text-white"><RotateCcw size={14} /></button>}
            </div>
          </div>
          <div className="rounded-xl border-[3px] border-[#8be9fd] bg-black/30 shadow-[5px_5px_0_rgba(139,233,253,.25)]">
            <p className="rounded-t-lg border-b-[3px] border-[#8be9fd] bg-[#151b4d] px-3 py-1 font-['Press_Start_2P'] text-[9px] text-[#8be9fd]">♪ LYRICS</p>
            <div className="max-h-96 overflow-y-auto px-3 py-2" style={{ fontFamily: "'Zpix','DotGothic16',monospace", fontSize: 16 }}>
              {lrc.map((l, i) => <p key={i} id={`plrc-${i}`} className={i === line ? 'text-[#ffe45e]' : 'text-white/40'}>{i === line ? '▶ ' : ''}{l.x}</p>)}
            </div>
          </div>
        </div>
        {/* CD 机下方偏右：白色 iphone 有线耳机 */}
        <div className="pointer-events-none relative z-10 mx-auto -mt-2 flex w-[340px] justify-end md:w-[430px]">
          <svg viewBox="0 0 200 110" className="h-24 w-48" fill="none">
            <path d="M20 8 C 60 90, 110 95, 130 60" stroke="#8be9fd" strokeWidth="7" strokeLinecap="round" opacity=".85" />
            <path d="M20 8 C 60 90, 110 95, 130 60" stroke="#0b1e5b" strokeWidth="1.8" strokeLinecap="round" />
            <rect x="12" y="0" width="16" height="10" rx="2" fill="#fff" stroke="#8be9fd" strokeWidth="2" />
            <g transform="translate(130,60)">
              <rect x="-6" y="-22" width="12" height="26" rx="6" fill="#fff" stroke="#8be9fd" strokeWidth="2" />
              <circle cx="0" cy="-14" r="2.5" fill="#0b1e5b" /><circle cx="0" cy="-8" r="2.5" fill="#0b1e5b" />
              <rect x="-2" y="4" width="4" height="18" fill="#fff" stroke="#8be9fd" strokeWidth="2" />
            </g>
            <g transform="translate(162,52) rotate(18)">
              <rect x="-6" y="-22" width="12" height="26" rx="6" fill="#fff" stroke="#8be9fd" strokeWidth="2" />
              <circle cx="0" cy="-14" r="2.5" fill="#0b1e5b" /><circle cx="0" cy="-8" r="2.5" fill="#0b1e5b" />
            </g>
          </svg>
        </div>
        {/* 进度条：位置/结构跟白天场一样（耳机下方、全宽），霓虹配色；可拖动 seek */}
        <div className="relative z-10 mx-auto mt-4 w-full max-w-3xl px-4 pb-8">
          <div className="rounded-2xl border-[3px] border-[#8be9fd] bg-[#0d1440]/90 p-4 shadow-[5px_5px_0_rgba(139,233,253,.25)]">
            <div className="flex items-center gap-3">
              <span className="w-14 text-right text-xl">{fmt(currentTime)}</span>
              <input type="range" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); setCurrentTime(Number(e.target.value)); }} className="flex-1" />
              <span className="w-14 text-xl">{fmt(duration)}</span>
            </div>
            <div className="mt-2 flex items-center justify-center gap-5">
              <button className="rounded-full border border-[#8be9fd] p-2"><SkipBack size={22} /></button>
              <button onClick={togglePlay} className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff6aad] text-white">{isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}</button>
              <button className="rounded-full border border-[#8be9fd] p-2"><SkipForward size={22} /></button>
            </div>
            {hasFinished && !voted && <button onClick={() => vote(song.id)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6aad] py-2.5 font-bold"><Heart size={18} /> 推荐这首</button>}
            {voted && <p className="py-2 text-center font-bold text-[#ffe45e]">✨ 已推荐 · 来自 {song.school} 的 {song.author}</p>}
          </div>
        </div>
        <audio ref={audioRef} src={song.audioUrl} preload="metadata" crossOrigin="anonymous" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#7ba4f5] pb-10 font-['VT323']" style={{ imageRendering: 'pixelated' }}>
      <style>{`${FONTS}@keyframes marquee{0%{transform:translateX(105%)}100%{transform:translateX(-105%)}}@keyframes spinDisc{to{transform:rotate(360deg)}}@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}`}</style>
      <svg width="0" height="0" className="absolute"><defs>
        <filter id="paintify"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="14" /><feColorMatrix type="matrix" values="1.4 0 0 0 -0.12 0 1.25 0 0 -0.1 0 0 1.35 0 -0.12 0 0 0 1 0" /></filter>
      </defs></svg>
      {/* 1. 盲听页同款蓝色条纹 */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.28)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,0.28)_1.5px,transparent_1.5px)] bg-[length:30px_30px]" />
      {/* 2. 云朵 */}
      <span className="pointer-events-none absolute left-[5%] top-24 text-5xl" style={{ animation: 'floaty 5s ease-in-out infinite' }}>☁️</span>
      <span className="pointer-events-none absolute right-[6%] top-48 text-4xl" style={{ animation: 'floaty 6.5s ease-in-out infinite' }}>☁️</span>
      <span className="pointer-events-none absolute left-[12%] top-[46%] text-3xl opacity-80" style={{ animation: 'floaty 7s ease-in-out infinite' }}>☁️</span>

      <div className="relative z-10 flex items-center justify-between px-5 pt-4">
        <button onClick={() => navigate(-1)} className="border-[3px] border-[#2b1a4e] bg-white p-2 shadow-[3px_3px_0_#2b1a4e]"><ChevronDown size={20} /></button>
        <p className="font-['Press_Start_2P'] text-[10px] text-white" style={{ textShadow: '2px 2px 0 #2b1a4e' }}>♪ NOW PLAYING — {song.title}</p>
        <button onClick={toggleTheme} className="border-[3px] border-[#2b1a4e] bg-[#2e2a5e] p-2 text-[#ffe45e]"><Moon size={18} /></button>
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-4">
        <p className="mt-3 text-center font-['DotGothic16'] text-2xl tracking-[.3em] text-white md:text-4xl" style={{ textShadow: '4px 4px 0 #2b1a4e' }}>CAMPUS ★ BEATS</p>

        <div className="relative mx-auto mt-3 w-[340px] md:w-[430px]" style={{ perspective: '1200px' }}>
          <div className="relative rounded-full border-[3px] border-[#3a3f4a] px-6 pb-8 pt-28 shadow-[8px_10px_0_#2b1a4e]"
            style={{ background: 'linear-gradient(180deg,#ffffff 0%,#eceef2 40%,#d3d7df 70%,#b4b9c4 100%)' }}>
            {/* 3. 显示屏：仅关盖显示 */}
            {!open && (
              <div className="absolute left-1/2 top-4 w-60 -translate-x-1/2">
                <div className="relative flex items-center justify-center">
                  <span className="absolute -left-1 top-1/2 h-8 w-10 -translate-y-1/2 rounded-l-full border-2 border-[#3a3f4a] bg-gradient-to-b from-white to-[#b9bfcb]" />
                  <span className="absolute -right-1 top-1/2 h-8 w-10 -translate-y-1/2 rounded-r-full border-2 border-[#3a3f4a] bg-gradient-to-b from-white to-[#b9bfcb]" />
                  <div className="relative z-10 w-44 rounded-[50%] border-[3px] border-[#3a3f4a] bg-gradient-to-b from-[#9aa0ad] to-[#5d636f] px-4 py-2">
                    <div className="overflow-hidden rounded-[50%] border-2 border-black bg-[#cfe6f2] px-2 py-1">
                      <p className="whitespace-nowrap font-['DotGothic16'] text-base leading-none text-[#2b4a5e]" style={{ animation: 'marquee 2.2s linear infinite, blink 1s steps(2) infinite' }}>MUSIC♪MUSIC♪{song.title}♪</p>
                    </div>
                  </div>
                  {/* 4. 显示器后下半部耳机 */}
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-3xl">🎧</span>
                </div>
              </div>
            )}
            {/* 8. 黑盘做大、边缘薄、中心圈大 */}
            <div className="relative mx-auto mt-10" style={{ width: 308, height: 308 }}>
              <WalkmanDisc spin={open && isPlaying} />
              <button onClick={() => photoRef.current?.click()} className="absolute left-1/2 top-1/2 h-[172px] w-[172px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[3px] border-[#3a3f4a] bg-[#9aa3b5] outline outline-4 outline-white/60">
                {photo ? <img src={photo} alt="" className="h-full w-full object-cover" style={{ imageRendering: 'pixelated', ...(painted ? { filter: 'url(#paintify) saturate(1.6) contrast(1.08)' } : {}) }} />
                  : <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-[#2b1a4e]"><Camera size={32} /><span className="font-['Noto_Sans_SC'] text-sm font-bold">记录此刻</span></span>}
              </button>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </div>
            {/* 7. G-PROTECTION → 歌名 */}
            <p className="mt-3 truncate px-4 text-center font-['Press_Start_2P'] text-[9px] tracking-[.2em] text-[#3a3f4a]">♪ {song.title} ♪</p>
          </div>
          {/* 9/10. 翻盖随鼠标+音乐，无按钮无TAP字 */}
          <div className="pointer-events-none absolute inset-x-0 top-0" style={{ transform: `rotateX(${lid * 102}deg)`, transformOrigin: '50% 8%', opacity: lid >= 0.98 ? 0 : 1 }}>
            <div className="rounded-full border-[3px] border-[#3a3f4a] px-6 pb-12 pt-28" style={{ background: 'linear-gradient(180deg,#ffffff,#dfe3ea 60%,#b9bfcb)' }}>
              <div className="mx-auto border-2 border-dashed border-[#9aa0ad] bg-black/5" style={{ width: 268, height: 268, borderRadius: '50%' }} />
            </div>
          </div>
          </div>
          
        {/* 5. 左下方图一光盘 → 页面更左下方 */}
        <div className="pointer-events-none fixed bottom-6 left-4 z-20 md:left-8">
          <TeddyCD spin={isPlaying} />
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="mx-auto mt-2 flex max-w-md flex-wrap items-center justify-center gap-2">
            <button onClick={() => photoRef.current?.click()} className="flex items-center gap-1 border-[3px] border-[#2b1a4e] bg-white px-3 py-1.5 font-['Press_Start_2P'] text-[10px] shadow-[3px_3px_0_#2b1a4e]"><Camera size={14} /> 记录此刻</button>
            <button onClick={() => setPainted((p) => !p)} disabled={!photo} className="flex items-center gap-1 border-[3px] border-[#2b1a4e] bg-[#ffe45e] px-3 py-1.5 font-['Press_Start_2P'] text-[10px] shadow-[3px_3px_0_#2b1a4e] disabled:opacity-40"><Palette size={14} /> {painted ? '看原图' : '一键如画'}</button>
            {photo && <button onClick={() => { setPhoto(null); setPainted(false); }} className="border-[3px] border-[#2b1a4e] bg-white px-2 py-1.5"><RotateCcw size={14} /></button>}
          </div>
        {/* 13. 歌词实时滚动 → 右边 */}
        </div>
        <div className="rounded-xl border-[3px] border-[#2b1a4e] bg-white/85 shadow-[5px_5px_0_#2b1a4e]">
          <p className="border-b-[3px] border-[#2b1a4e] bg-[#fff3a6] px-3 py-1 font-['Press_Start_2P'] text-[9px]">♪ LYRICS</p>
          <div className="max-h-96 overflow-y-auto px-3 py-2" style={{ fontFamily: "'Zpix','DotGothic16',monospace", fontSize: 16 }}>
            {lrc.map((l, i) => <p key={i} id={`plrc-${i}`} className={i === line ? 'text-[#ff3d7f]' : 'text-[#2b1a4e]/50'}>{i === line ? '▶ ' : ''}{l.x}</p>)}
        </div>
      </div>
        </div>

        {/* CD 机下面偏右：iphone 有线耳机 */}
        <div className="pointer-events-none relative mx-auto -mt-2 flex w-[340px] justify-end md:w-[430px]">
          <svg viewBox="0 0 200 110" className="h-24 w-48" fill="none">
            <path d="M20 8 C 60 90, 110 95, 130 60" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
            <path d="M20 8 C 60 90, 110 95, 130 60" stroke="#2b1a4e" strokeWidth="1.8" strokeLinecap="round" />
            <rect x="12" y="0" width="16" height="10" rx="2" fill="#fff" stroke="#2b1a4e" strokeWidth="2" />
            <g transform="translate(130,60)">
              <rect x="-6" y="-22" width="12" height="26" rx="6" fill="#fff" stroke="#2b1a4e" strokeWidth="2" />
              <circle cx="0" cy="-14" r="2.5" fill="#2b1a4e" /><circle cx="0" cy="-8" r="2.5" fill="#2b1a4e" />
              <rect x="-2" y="4" width="4" height="18" fill="#fff" stroke="#2b1a4e" strokeWidth="2" />
            </g>
            <g transform="translate(162,52) rotate(18)">
              <rect x="-6" y="-22" width="12" height="26" rx="6" fill="#fff" stroke="#2b1a4e" strokeWidth="2" />
              <circle cx="0" cy="-14" r="2.5" fill="#2b1a4e" /><circle cx="0" cy="-8" r="2.5" fill="#2b1a4e" />
            </g>
          </svg>
        </div>

        {/* 11. 黑夜场长度进度条 */}
        <div className="mx-auto mt-4 max-w-3xl rounded-2xl border-[3px] border-[#2b1a4e] bg-white/90 p-4 shadow-[5px_5px_0_#2b1a4e]">
          <div className="flex items-center gap-3">
            <span className="w-14 text-right text-xl">{fmt(currentTime)}</span>
            <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => { audioRef.current.currentTime = Number(e.target.value); setCurrentTime(Number(e.target.value)); }} className="flex-1" />
            <span className="w-14 text-xl">{fmt(duration)}</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-5">
            <button className="border-[3px] border-[#2b1a4e] bg-white p-2"><SkipBack size={22} /></button>
            <button onClick={togglePlay} className="flex h-16 w-16 items-center justify-center border-[3px] border-white bg-gradient-to-br from-[#ff6aad] to-[#8b5cf6] text-white shadow-[4px_4px_0_#2b1a4e]">{isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}</button>
            <button className="border-[3px] border-[#2b1a4e] bg-white p-2"><SkipForward size={22} /></button>
          </div>
          {hasFinished && !voted && <button onClick={() => vote(song.id)} className="mt-3 flex w-full items-center justify-center gap-2 border-[3px] border-white bg-[#ff6aad] py-2.5 font-['Noto_Sans_SC'] font-bold text-white"><Heart size={18} /> 推荐这首</button>}
          {voted && <p className="py-2 text-center font-bold text-[#ff3d7f]">✨ 已推荐 · 来自 {song.school} 的 {song.author}</p>}
        </div>
      </div>
      <audio ref={audioRef} src={song.audioUrl} preload="metadata" crossOrigin="anonymous" />
    </div>
  );
}
