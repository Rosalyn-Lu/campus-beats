import { useEffect, useMemo, useRef, useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { Heart, Music2, Pause, Play, UploadCloud, X, Sparkles, Dices } from 'lucide-react';
import { Win, PageShell, FONTS } from '../theme';
const POOLS = {
  '民谣': [['晚风信件', '吉他与你'], ['操场黄昏', '路灯民谣人']],
  '摇滚': [['失真心跳', '霓虹噪音'], ['午夜引擎', '铁皮乐队']],
  '电子': [['像素银河', '霓虹DJ'], ['电流甜心', '午夜合成器']],
  '流行': [['心动频道', '星光歌手'], ['彩虹电台', '泡泡音']],
  '嘻哈': [['街区诗人', '节拍玩家'], ['午夜巴士', '麦克风猎人']],
  '古典': [['月光练习曲', '琴房夜曲'], ['弦上星光', '白键旅人']],
  '爵士': [['蓝调咖啡馆', '萨克斯先生'], ['雨夜爵士', '微醺小号']],
  '氛围': [['雾中电台', '梦境调频'], ['深海信号', '云端漫步']],
  '默认': [['未命名心动', '深夜Demo人'], ['耳机里的星', '试音室朋友']],
};
export default function Upload() {
  const { addSong, updateCover, songs, isDarkMode: d } = useRadio();
  const [form, setForm] = useState({ title: '', genres: [], school: '', author: '' });
  const [f, setF] = useState(null); const [pv, setPv] = useState(null);
  const [drag, setDrag] = useState(false); const [ok, setOk] = useState(false);
  const [playing, setPlaying] = useState(false); const [pg, setPg] = useState(0); const [du, setDu] = useState(0);
  const [seed, setSeed] = useState(0); const [picked, setPicked] = useState(false);
  const [cover, setCover] = useState(null); const [coverPv, setCoverPv] = useState(null); const [synced, setSynced] = useState(false);
  const coverRef = useRef(null);
  const [hearts, setHearts] = useState([false, false, false, false, false, false]);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const fr = useRef(null); const ar = useRef(null);
  const gs = ['民谣', '摇滚', '电子', '流行', '嘻哈', '古典', '爵士', '氛围'];
  const can = form.title && form.genres.length > 0 && form.school && form.author && f;
  useEffect(() => { const a = ar.current; if (!a) return; const t = () => setPg(a.currentTime); const m = () => setDu(a.duration || 0); const e = () => setPlaying(false); a.addEventListener('timeupdate', t); a.addEventListener('loadedmetadata', m); a.addEventListener('ended', e); return () => { a.removeEventListener('timeupdate', t); a.removeEventListener('loadedmetadata', m); a.removeEventListener('ended', e); }; }, [pv]);
  const take = (file) => { if (file && file.type.startsWith('audio/')) { setPlaying(false); setPg(0); setF(file); setPv(URL.createObjectURL(file)); setPicked(false); } };
  const fmt = (s) => (!s || Number.isNaN(s) ? '0:00' : `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`);
  // demo 风格猜测：文件名关键词 + 已选风格 + 文件大小抖动
  const guess = useMemo(() => {
    if (!f) return null;
    const name = (f.name || '').toLowerCase();
    const hit = gs.find((g) => name.includes(g)) || form.genres[0];
    if (hit) return hit;
    const keys = Object.keys(POOLS).filter((k) => k !== '默认');
    return keys[Math.floor(((f.size || 0) / 997 + seed) % keys.length)];
  }, [f, form.genres, seed]);
  const suggestion = useMemo(() => {
    const pool = POOLS[guess] || POOLS['默认'];
    const pick = pool[(seed + (f ? f.name.length : 0)) % pool.length];
    return { title: pick[0], artist: pick[1], style: guess || '未知风格' };
  }, [guess, seed, f]);
  const useSuggestion = () => { setForm((p) => ({ ...p, title: suggestion.title, author: p.author || suggestion.artist })); setPicked(true); };
  const field = `w-full rounded-lg border-[3px] px-3 py-2 font-['VT323'] text-2xl focus:outline-none ${d ? 'border-[#8be9fd] bg-[#151b4d] text-cyan-50 placeholder:text-cyan-200/40' : 'border-[#2b1a4e] bg-white placeholder:text-[#c9a6d8]'}`;
  return (
    <PageShell dark={d}>
      <style>{FONTS}</style>
      <div className="grid items-start gap-5 lg:grid-cols-[290px_minmax(0,1fr)_270px]">
        <div className="flex flex-col space-y-5 self-stretch">
          <Win dark={d} title="TITLE-O-MATIC" bar="bg-[#ffc7e8]">
            <div className={`space-y-2 p-3 ${d ? 'bg-[#241a5e]' : 'bg-[#f9c8e4]'}`}>
              <p className={`rounded-lg border-2 border-dashed px-2 py-1.5 text-center font-['VT323'] text-xl ${d ? 'border-[#8be9fd] text-cyan-100' : 'border-[#2b1a4e]'}`}>
                {f ? <>灵感: <b>{suggestion.title}</b><br />by {suggestion.artist} · {suggestion.style}</> : '先丢 demo 进来，再点 YES!'}
              </p>
              <button onClick={useSuggestion} disabled={!f} className="w-full rounded-lg border-[3px] border-white bg-[#ff6aad] py-2.5 font-['Press_Start_2P'] text-[10px] text-white transition hover:scale-[1.03] disabled:opacity-40">YES 采用!</button>
              <button onClick={() => { setSeed((s) => s + 1); setPicked(false); }} disabled={!f} className="flex w-full items-center justify-center gap-1 rounded-lg border-[3px] border-white bg-[#b9a7ff] py-2.5 font-['Press_Start_2P'] text-[10px] text-white transition hover:scale-[1.03] disabled:opacity-40"><Dices size={13} /> NO 换一个</button>
              {picked && <p className="text-center font-['VT323'] text-xl text-[#ff3d7f]">♥ 已填入歌名栏，可再改!</p>}
            </div>
          </Win>
          <Win dark={d} title="♥ TO-DO LIST" bar="bg-white"><ul className={`space-y-1 p-4 font-['VT323'] text-2xl ${d ? 'bg-[#151b4d] text-cyan-50' : 'bg-[#ffe9f6]'}`}>
            {[{ k: !!f, t: 'upload audio' }, { k: !!(form.title && form.author), t: 'song + artist' }, { k: !!form.school, t: 'school info' }, { k: form.genres.length > 0, t: 'genre tags' }].map((i) => (<li key={i.t} className="flex gap-2"><span className={i.k ? 'text-[#ff3d7f]' : 'opacity-40'}>{i.k ? '♥' : '♡'}</span><span className={i.k ? 'line-through opacity-60' : ''}>— {i.t}</span></li>))}</ul></Win>
          <div className="flex items-center justify-center gap-1.5">{hearts.map((on, k) => (
              <button key={k} onClick={() => setHearts((p) => p.map((x, j) => (j === k ? !x : x)))} className="text-3xl transition hover:scale-125">{on ? '🤍' : '🖤'}</button>
            ))}</div>
        </div>
        <Win dark={d} title="<- -> C ♥ DEMO-UPLOAD" bar={d ? 'bg-[#3b2a86]' : 'bg-[#ffb3dd]'} body={d ? 'bg-[#241a5e]' : 'bg-[#f9a8d4]'}>
          <div className="p-3 md:p-4">
            {/* demo 试上传区：可用试听 */}
            <div className={`overflow-hidden rounded-xl border-[3px] ${d ? 'border-[#8be9fd]' : 'border-[#2b1a4e]'}`}>
              <div className={`flex min-h-44 flex-col items-center justify-center px-4 py-6 md:min-h-52 ${d ? 'bg-gradient-to-br from-[#0b2a6b] via-[#5b2a86] to-[#ff2f92]' : 'bg-gradient-to-br from-[#ff6aad] via-[#8b5cf6] to-[#59d6e6]'}`}>
                {pv ? (
                  <div className="w-full text-center">
                    <Music2 className="mx-auto mb-1 h-10 w-10 text-white" />
                    <p className="truncate px-2 font-['VT323'] text-2xl text-white">{f?.name}</p>
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-black/40 px-3 py-0.5 font-['VT323'] text-xl text-[#ffe45e]"><Sparkles size={14} /> 试听分析: {guess} · {fmt(du)} · {(f.size / 1024 / 1024).toFixed(1)}MB</p>
                    <button onClick={() => { const a = ar.current; if (!a) return; playing ? (a.pause(), setPlaying(false)) : (a.play(), setPlaying(true)); }} className="mx-auto mt-2 flex items-center gap-2 rounded-full border-[3px] border-white bg-white/20 px-5 py-1.5 font-['Press_Start_2P'] text-[10px] text-white backdrop-blur hover:bg-white/35">
                      {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'PAUSE 暂停试听' : 'PLAY 试听 demo'}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fr.current?.click()} className="text-center">
                    <p className="font-['Press_Start_2P'] text-sm text-cyan-200 drop-shadow-[3px_3px_0_rgba(0,0,0,.5)]">ARCADE</p>
                    <p className="mt-2 font-['Press_Start_2P'] text-xl text-[#ffe45e] drop-shadow-[3px_3px_0_rgba(0,0,0,.5)]">STREET BEAT</p>
                    <p className="mt-2 font-['Noto_Sans_SC'] text-base font-bold text-white/90">点我把 demo 丢进来试上传试听</p>
                  </button>
                )}
              </div>
              <div className={d ? 'bg-[#151b4d] px-4 py-3' : 'bg-[#f9a8d4] px-4 py-3'} style={{ borderTop: `3px solid ${d ? '#8be9fd' : '#2b1a4e'}` }}>
                <p className={`mb-2 truncate text-center font-['Press_Start_2P'] text-[8px] ${d ? 'text-cyan-100' : ''}`}>{(form.title || 'UNTITLED') + ' — ' + (form.author || 'UNKNOWN')}</p>
                <div className={`h-3 rounded-full border-2 ${d ? 'border-[#8be9fd] bg-black/40' : 'border-[#2b1a4e] bg-white'}`}><div className="h-full rounded-full bg-gradient-to-r from-[#ffe45e] to-[#ff6aad]" style={{ width: du ? `${(pg / du) * 100}%` : '4%' }} /></div>
                <div className="mt-1 flex items-center justify-between font-['VT323'] text-xl"><span className={d ? 'text-cyan-100' : ''}>{fmt(pg)}</span>
                  <span className="flex gap-2"><button onClick={() => { const a = ar.current; if (!a) return; playing ? (a.pause(), setPlaying(false)) : (a.play(), setPlaying(true)); }} disabled={!pv} className={`rounded border-2 px-2 disabled:opacity-40 ${d ? 'border-[#8be9fd] bg-white/10 text-white' : 'border-[#2b1a4e] bg-white'}`}>{playing ? <Pause size={14} /> : <Play size={14} />}</button></span>
                  <span className={d ? 'text-cyan-100' : ''}>{fmt(du)}</span></div>
              </div>
            </div>
            <audio ref={ar} src={pv || undefined} preload="metadata" />
            <form onSubmit={(e) => { e.preventDefault(); if (!can) return; addSong({ id: Date.now(), title: form.title, cover: coverPv || `https://picsum.photos/seed/${Date.now()}/300/300`, genre: form.genres, school: form.school, author: form.author, votes: 0, audioUrl: pv }); setOk(true); setTimeout(() => { setOk(false); setForm({ title: '', genres: [], school: '', author: '' }); setF(null); setPv(null); setPicked(false); setCover(null); setCoverPv(null); setSynced(false); }, 2400); }} className={`mt-4 rounded-xl border-[3px] p-4 ${d ? 'border-[#8be9fd] bg-[#151b4d]' : 'border-[#2b1a4e] bg-[#fff6ea]'}`}>
              <div onClick={() => fr.current?.click()} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files[0]); }} className={`cursor-pointer rounded-lg border-[3px] border-dashed p-5 text-center ${drag ? 'bg-[#fff3a6]' : d ? 'bg-white/5 text-cyan-50' : 'bg-white'}`} style={{ borderColor: d ? '#8be9fd' : '#2b1a4e' }}>
                {f ? (<div className="flex items-center justify-center gap-2"><span className="truncate font-['VT323'] text-2xl">{f.name}</span><button type="button" onClick={(ev) => { ev.stopPropagation(); setF(null); setPv(null); setPlaying(false); }} className="bg-white p-1 text-black"><X size={14} /></button></div>) : (<div><UploadCloud className="mx-auto mb-1" /><p className="font-['VT323'] text-2xl">点击 / 拖拽上传 mp3 · wav · m4a</p></div>)}
              </div>
              <input ref={fr} type="file" accept="audio/*" className="hidden" onChange={(e) => take(e.target.files[0])} />
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div><span className="mb-1 block font-['Press_Start_2P'] text-[9px]">♥ SONG *</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} placeholder={suggestion.title} /></div>
                <div><span className="mb-1 block font-['Press_Start_2P'] text-[9px]">♥ ARTIST *</span><input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={field} placeholder={suggestion.artist} /></div>
              </div>
              <div className="mt-3"><span className="mb-1 block font-['Press_Start_2P'] text-[9px]">♥ SCHOOL *</span><input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} className={field} placeholder="学校" /></div>
              <div className="mt-3"><span className="mb-1 block font-['Press_Start_2P'] text-[9px]">♥ GENRE (MAX 3) *</span>
                <div className="flex flex-wrap gap-2">{gs.map((g) => { const on = form.genres.includes(g); return (<button type="button" key={g} onClick={() => setForm((p) => ({ ...p, genres: p.genres.includes(g) ? p.genres.filter((x) => x !== g) : p.genres.length < 3 ? [...p.genres, g] : p.genres }))} className={`flex items-center gap-1 rounded-lg border-[3px] px-3 py-0.5 font-['VT323'] text-2xl ${on ? 'border-white bg-[#ff6aad] text-white' : d ? 'border-[#8be9fd] bg-white/10 text-cyan-50' : 'border-[#2b1a4e] bg-white'}`}>{on && <Heart size={12} className="fill-white" />}{g}</button>); })}</div></div>
              <button disabled={!can} className="mt-4 w-full rounded-lg border-[3px] border-white bg-[#ff6aad] py-3 font-['Press_Start_2P'] text-[11px] text-white disabled:opacity-40">▶ PUBLISH 发布</button>
            </form>
          </div>
        </Win>
        <div className="space-y-5">
          <Win dark={d} title={new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' }).format(now)} bar="bg-[#fff3a6]"><div className={`p-3 text-center font-['Press_Start_2P'] text-xl ${d ? 'bg-[#151b4d] text-[#ffe45e]' : 'bg-white'}`}>{(() => { const parts = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' }).format(now).split(':'); const h24 = Number(parts[0]); const mm = parts[1]; const h12 = h24 % 12 === 0 ? 12 : h24 % 12; return h24 < 12 ? `☀ ${h12}:${mm} AM` : `☾ ${h12}:${mm} PM`; })()}</div></Win>
          <Win dark={d} title="♥ WELCOME" bar="bg-[#d6c2ff]"><div className={`flex items-center gap-3 p-3 ${d ? 'bg-[#151b4d] text-cyan-50' : 'bg-[#efe4ff]'}`}><div className="text-3xl">🐶</div><p className="font-['Noto_Sans_SC'] text-base font-bold">音乐的存在，是为了表达出语言无法表达之事，大声分享吧 🎵</p></div></Win>
          <Win dark={d} title="SAVE.DAT" bar="bg-[#8be9fd]"><div className={`flex items-center gap-2 p-3 ${d ? 'bg-[#0e2a4b] text-cyan-100' : 'bg-[#e8f9ff]'}`}><div className="text-2xl">💾</div><p className="font-['VT323'] text-2xl">{can ? 'READY! 可以发布了' : "DON'T FORGET TO SAVE!"}</p></div></Win>
          <Win dark={d} title="♥ COVER.IMG" bar="bg-[#ffc7e8]" className="flex flex-1 flex-col">
            <div className={`flex flex-1 flex-col p-3 ${d ? 'bg-[#151b4d] text-cyan-50' : 'bg-[#fff0f7]'}`}>
              <div onClick={() => coverRef.current?.click()} className={`flex min-h-56 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-[3px] border-dashed text-center ${d ? 'border-[#8be9fd]' : 'border-[#2b1a4e] bg-white'}`}>
                {coverPv ? <img src={coverPv} className="h-56 w-full object-cover" alt="专辑封面预览" /> : <p className="p-5 font-['VT323'] text-2xl">点我上传专辑封面 🖼</p>}
              </div>
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const img = e.target.files[0]; if (img) { setCover(img); setCoverPv(URL.createObjectURL(img)); setSynced(false); } e.target.value = null; }} />
              {coverPv && (
                <button onClick={() => { if (songs[0]) { updateCover(songs[0].id, coverPv); setSynced(true); } }} className="mt-2 w-full rounded-lg border-[3px] border-white bg-[#b9a7ff] py-2 font-['Press_Start_2P'] text-[10px] text-white">SYNC 同步到盲听榜</button>
              )}
              <p className="mt-1 text-center font-['VT323'] text-xl opacity-70">{synced ? '♥ 已实时更新到盲听榜首!' : coverPv ? '将用作本次发布封面' : 'jpg / png，发布时自动使用'}</p>
            </div>
          </Win>
        </div>
      </div>
      {ok && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className={`w-full max-w-sm rounded-xl border-[3px] ${d ? 'border-[#8be9fd]' : 'border-[#2b1a4e]'} bg-white text-center`}><div className="border-b-[3px] border-[#2b1a4e] bg-[#d6c2ff] py-2 font-['Press_Start_2P'] text-[10px]">BE HAPPY</div><div className="p-8"><p className="font-['Press_Start_2P'] text-lg">THANK YOU</p><p className="mt-2 font-['Noto_Sans_SC'] font-bold">发布成功，去盲听页听听吧 ♡</p><button onClick={() => setOk(false)} className="mt-5 bg-[#2b1a4e] px-10 py-2.5 font-['Press_Start_2P'] text-[10px] text-white">OK</button></div></div></div>)}
    </PageShell>
  );
}
