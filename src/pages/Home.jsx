import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRadio } from '../context/RadioContext';
import { Heart, Play, Search } from 'lucide-react';
import { Win, PageShell, FONTS } from '../theme';
export default function Home() {
  const { songs, hasVoted, vote, isDarkMode: d } = useRadio();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [liked, setLiked] = useState([true, true, true, true, false, false]);
  const dur = (s, i) => s.duration || `02:${((i * 53 + 12) % 60).toString().padStart(2, '0')}`;
  const rots = ['-2deg', '1.2deg', '-1deg', '2deg'];
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return songs.map((s, i) => ({ s, i }));
    return songs.map((s, i) => ({ s, i })).filter(({ s }) =>
      (Array.isArray(s.genre) ? s.genre.join(' ') : s.genre || '').toLowerCase().includes(t) ||
      (s.title || '').toLowerCase().includes(t));
  }, [songs, q]);
  return (
    <PageShell dark={d}>
      <style>{FONTS}</style>
      {/* 可用搜索栏：按风格搜 */}
      <div className="mb-5 flex gap-3">
        <label className={`flex flex-1 items-center gap-2 rounded-xl px-4 py-2.5 ${d ? 'border-[3px] border-[#8be9fd] bg-[#151b4d] text-cyan-100' : 'border-[3px] border-[#2b1a4e] bg-white shadow-[5px_5px_0_#2b1a4e]'}`}>
          <Search size={16} strokeWidth={3} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索风格: 民谣 / 摇滚 / 电子..." className={`w-full bg-transparent font-['VT323'] text-2xl outline-none ${d ? 'placeholder:text-cyan-200/40' : 'placeholder:text-[#b9a7d8]'}`} />
          {q && <button onClick={() => setQ('')} className="font-['Press_Start_2P'] text-[9px] opacity-60">X</button>}
        </label>
        <div className="hidden items-center rounded-xl border-[3px] border-[#2b1a4e] bg-[#fff3a6] px-5 font-['Press_Start_2P'] text-[10px] shadow-[5px_5px_0_#2b1a4e] md:flex">♪ ON AIR</div>
      </div>
      <Win dark={d} peek title="♥ LISTEN WITH BARE EARS" bar={d ? 'bg-[#3b2a86]' : 'bg-[#ffa8dc]'} body={d ? 'bg-[#1a1445]' : 'bg-[#e3b8f5]'}>
        <div className="p-3 md:p-5">
          <div className="mb-5 text-center">
            <p className={`font-['VT323'] text-2xl tracking-widest ${d ? 'text-[#8be9fd]' : 'text-[#7F5AA3]'}`}>★ own the moment · star wave ★</p>
            <h1 className={`mt-1 font-['Press_Start_2P'] text-lg md:text-2xl ${d ? 'text-white drop-shadow-[3px_3px_0_#ff3d7f]' : 'text-[#F3DF7E] drop-shadow-[3px_3px_0_#fff]'}`}>盲听投票</h1>
            <p className={`mt-2 font-['Noto_Sans_SC'] text-base font-bold ${d ? 'text-cyan-100/80' : 'text-[#feffea]'}`}>当音乐击中你时，你不会感到疼痛 💘</p>
          </div>
          {list.length === 0 && <p className="mb-4 text-center font-['VT323'] text-2xl opacity-60">没有找到 “{q}” 风格，换个关键词试试~</p>}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map(({ s, i }) => {
              const v = hasVoted(s.id);
              return (
                <div key={s.id} className={`rounded-xl p-4 ${d ? 'border-[3px] border-[#8be9fd] bg-[#241a5e]' : 'border-[3px] border-[#2b1a4e] bg-white shadow-[5px_5px_0_#2b1a4e]'}`} style={{ transform: `rotate(${rots[i % 4]})` }}>
                  <div className="mb-2 flex justify-between font-['Press_Start_2P'] text-[8px] opacity-70"><span>No.{String(i + 1).padStart(2, '0')}</span><span>♪ {dur(s, i)}</span></div>
                  <div className={`group relative cursor-pointer overflow-hidden rounded-lg border-[3px] ${d ? 'border-[#8be9fd]' : 'border-[#2b1a4e]'}`} onClick={() => nav(`/player/${s.id}`)}>
                    <img src={s.cover} className="h-44 w-full object-cover transition group-hover:scale-105" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/35"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white opacity-0 group-hover:opacity-100"><Play size={20} className="ml-0.5" /></span></div>
                    <span className="absolute bottom-2 right-2 bg-black/60 px-2 font-['VT323'] text-lg text-white">▶ {dur(s, i)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className={`font-['Noto_Sans_SC'] text-base font-bold ${d ? 'text-white' : ''}`}>盲听 #{i + 1} 号作品</p>
                  </div>
                  <div className={`mt-1 h-2.5 overflow-hidden rounded-full border-2 ${d ? 'border-[#8be9fd] bg-black/40' : 'border-[#2b1a4e] bg-[#ffe9f6]'}`}><div className="h-full bg-gradient-to-r from-[#ffe45e] to-[#ff6aad]" style={{ width: `${Math.min(96, 20 + s.votes * 8)}%` }} /></div>
                  {v ? (
                    <button className="mt-2 w-full rounded-lg border-[3px] border-white bg-[#ff3d7f] py-2 font-['Noto_Sans_SC'] text-base font-bold text-white">♥ 已推荐 · {s.votes} 票</button>
                  ) : (
                    <button onClick={() => vote(s.id)} className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg border-[3px] py-2 font-['Noto_Sans_SC'] text-base font-bold transition hover:bg-[#ffe45e] ${d ? 'border-[#8be9fd] bg-white text-[#2b1a4e]' : 'border-[#2b1a4e] bg-[#fff7e0]'}`}><Heart size={18} strokeWidth={2.5} /> 推荐这首 ({s.votes})</button>
                  )}
                </div>
              );
            })}
          </div>
          {/* 底部爱心：未点黑色，点击变灰白银色 */}
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {liked.map((on, k) => (
              <button key={k} onClick={() => setLiked((p) => p.map((x, j) => (j === k ? !x : x)))} className="text-2xl transition hover:scale-125" style={{ color: on ? '#c0c4d0' : '#111111', filter: on ? 'grayscale(1)' : 'none' }}>
                {on ? '🤍' : '🖤'}
              </button>
            ))}
          </div>
        </div>
      </Win>
    </PageShell>
  );
}
