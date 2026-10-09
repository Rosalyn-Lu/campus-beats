import React, { useState } from 'react';
export const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Noto+Sans+SC:wght@400;500;700;900&display=swap');`;
export function Win({ title, children, bar = 'bg-[#ffa8dc]', body = 'bg-white', dark, className = '', peek, rightIcon }) {
  return (
    <div className={`overflow-hidden rounded-xl ${dark ? 'border-[3px] border-[#8be9fd] shadow-[6px_6px_0_rgba(139,233,253,.25)]' : 'border-[3px] border-[#2b1a4e] shadow-[6px_6px_0_#2b1a4e]'} ${className}`}>
      <div className={`flex items-center gap-2 border-b-[3px] px-3 py-2 ${bar} ${dark ? 'border-[#8be9fd]' : 'border-[#2b1a4e]'}`}>
        <span className="flex gap-1.5">
          <i className={`block h-2.5 w-2.5 rounded-full bg-white ${dark ? 'border-2 border-[#8be9fd]' : 'border-2 border-[#2b1a4e]'}`} />
          <i className={`block h-2.5 w-2.5 rounded-full bg-[#ffe45e] ${dark ? 'border-2 border-[#8be9fd]' : 'border-2 border-[#2b1a4e]'}`} />
          <i className={`block h-2.5 w-2.5 rounded-full bg-[#ff5d8f] ${dark ? 'border-2 border-[#8be9fd]' : 'border-2 border-[#2b1a4e]'}`} />
        </span>
        <span className="flex-1 truncate text-center font-['Press_Start_2P'] text-[9px] text-[#2b1a4e]">{title}</span>
        {rightIcon ? <span className="flex h-11 w-11 items-center justify-center">{rightIcon}</span> : <PeekX dark={dark} />}
      </div>
      <div className={body}>{children}</div>
    </div>
  );
}
// 原样式 X 小方块，里面的 x 会往左上 / 右上看
export function PeekX({ dark }) {
  return (
    <span className={`relative flex h-5 w-5 items-center justify-center overflow-visible rounded bg-white font-['Press_Start_2P'] text-[10px] ${dark ? 'border-2 border-[#8be9fd]' : 'border-2 border-[#2b1a4e]'}`}>
      <style>{`@keyframes peekx{0%,100%{transform:translate(-2px,-2px)}50%{transform:translate(2px,-2px)}}.peekx{animation:peekx 1.2s ease-in-out infinite;}`}</style>
      <i className="peekx block not-italic">x</i>
    </span>
  );
}
// 左看看右看看的眼睛（保留备用）
export function LookEyes() {
  return (
    <span className="flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 border-2 border-[#2b1a4e]">
      <style>{`@keyframes look{0%,100%{transform:translateX(-2px)}50%{transform:translateX(2px)}}.look-dot{animation:look 1.1s ease-in-out infinite;}`}</style>
      {[0, 1].map((k) => (
        <span key={k} className="relative block h-3 w-3 overflow-hidden rounded-full bg-white border border-[#2b1a4e]">
          <i className="look-dot absolute left-1/2 top-1/2 block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2b1a4e]" style={{ animationDelay: `${k * 0.15}s` }} />
        </span>
      ))}
    </span>
  );
}
// 跳动小爱心，点击喷出更小的爱心
export function BoingHeart({ dark }) {
  const [pops, setPops] = useState([]);
  const boom = (e) => {
    const id = Date.now() + Math.random();
    const burst = Array.from({ length: 8 }).map((_, k) => ({ id: `${id}-${k}`, dx: (Math.random() - 0.5) * 90, dy: -30 - Math.random() * 60, s: 10 + Math.random() * 10 }));
    setPops((p) => [...p, ...burst]);
    setTimeout(() => setPops((p) => p.filter((x) => !String(x.id).startsWith(String(id)))), 900);
  };
  return (
    <span onClick={boom} className="relative inline-block cursor-pointer select-none animate-bounce text-3xl" title="点我!">
      💗
      {pops.map((p) => (
        <i key={p.id} className="pointer-events-none absolute left-1/2 top-0" style={{ fontSize: p.s, transform: `translate(${p.dx}px, ${p.dy}px)`, transition: 'transform .9s ease-out', fontStyle: 'normal' }}>💗</i>
      ))}
      <style>{`@keyframes heartbeat{0%,100%{transform:scale(1)}30%{transform:scale(1.25)}60%{transform:scale(.95)}}`}</style>
    </span>
  );
}
export function PageShell({ dark, children }) {
  const [angry, setAngry] = useState(false);
  return (
    <div className={`relative min-h-[calc(100vh-72px)] overflow-x-clip pb-20 font-['VT323'] ${dark ? 'bg-gradient-to-b from-[#0b1e5b] via-[#3b1d7a] to-[#12082e]' : 'bg-[#7ba4f5]'}`}>
      <div className={`pointer-events-none absolute inset-0 ${dark ? 'bg-[linear-gradient(rgba(139,233,253,0.12)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(139,233,253,0.12)_1.5px,transparent_1.5px)]' : 'bg-[linear-gradient(rgba(255,255,255,0.28)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,0.28)_1.5px,transparent_1.5px)]'} bg-[length:30px_30px]`} />
      {dark && <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(1.6px 1.6px at 12% 20%, #fff, transparent),radial-gradient(1.6px 1.6px at 70% 10%, #ffe45e, transparent),radial-gradient(2px 2px at 85% 60%, #8be9fd, transparent),radial-gradient(1.4px 1.4px at 30% 80%, #ff9ecf, transparent)' }} />}
      <style>{`@keyframes drift{0%,100%{transform:translateX(-12px) rotate(-4deg)}50%{transform:translateX(12px) rotate(4deg)}}@keyframes twinkle{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}.drift{animation:drift 5s ease-in-out infinite;}.twinkle{animation:twinkle 1.6s ease-in-out infinite;}`}</style>
      {/* 云朵：右边一只，飘出框外左右摇摆 */}
      <span className="drift pointer-events-none absolute -right-2 top-16 text-4xl md:right-2">☁️</span>
      {/* 星星：一闪一闪跳动 */}
      <span className="twinkle pointer-events-none absolute bottom-24 left-[5%] text-3xl">⭐</span>
      {/* 爱心：左边一只，跳动可点喷小心心 */}
      <span className="pointer-events-auto absolute left-[2%] top-24"><BoingHeart dark={dark} /></span>
      {/* 兔子：在原表情上改出生气脸 + 抖动 */}
      <button onClick={() => { setAngry((a) => !a); setTimeout(() => setAngry(false), 1600); }} title="点我会生气!" className="absolute bottom-20 right-[5%] text-5xl transition hover:scale-110 animate-bounce">
        <span className="relative inline-block">
          🐰
          {angry && <span className="absolute inset-0 flex animate-ping items-center justify-center text-4xl">😡</span>}
          {angry && <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-2xl">💢</span>}
        </span>
      </button>
      {angry && <span className="absolute bottom-36 right-[4%] rounded-lg border-2 border-[#2b1a4e] bg-white px-2 font-['Noto_Sans_SC'] text-sm font-bold">哼!别戳我!</span>}
      <div className="relative z-10 mx-auto max-w-6xl px-3 pt-6 md:px-6">{children}</div>
    </div>
  );
}
