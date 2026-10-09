import { useNavigate } from 'react-router-dom';
import { useRadio } from '../context/RadioContext';
import { Win, PageShell, FONTS } from '../theme';
// 图一：像素光盘 + 左上像素音符，全部 rect 拼，crispEdges 防卡通平滑
function PixelCD() {
  return (
    <svg viewBox="0 0 28 28" className="h-11 w-11" shapeRendering="crispEdges">
      {/* 左上像素音符 */}
      <g fill="#1c1c22">
        <rect x="2" y="2" width="2" height="8" /><rect x="4" y="2" width="5" height="2" /><rect x="7" y="4" width="2" height="6" />
        <rect x="1" y="10" width="4" height="3" /><rect x="6" y="10" width="4" height="3" />
      </g>
      {/* 光盘 */}
      <g>
        <rect x="9" y="5" width="12" height="2" fill="#c9ccd4" /><rect x="7" y="7" width="16" height="12" fill="#c9ccd4" /><rect x="9" y="19" width="12" height="2" fill="#c9ccd4" />
        <rect x="10" y="7" width="3" height="3" fill="#b48ae0" /><rect x="16" y="7" width="3" height="2" fill="#e8a7c3" /><rect x="8" y="12" width="4" height="2" fill="#f2b8c6" />
        <rect x="8" y="14" width="6" height="2" fill="#9be8b4" /><rect x="16" y="15" width="4" height="2" fill="#f6d9a0" /><rect x="10" y="16" width="4" height="2" fill="#c9a6f2" />
        {/* 描边 */}
        <rect x="9" y="5" width="12" height="1" fill="#3a3348" /><rect x="9" y="20" width="12" height="1" fill="#3a3348" /><rect x="7" y="7" width="1" height="12" fill="#3a3348" /><rect x="19" y="7" width="1" height="12" fill="#3a3348" />
        {/* 中心孔 */}
        <rect x="11" y="10" width="6" height="6" fill="#3a3348" /><rect x="12" y="11" width="4" height="4" fill="#1c1c22" /><rect x="13" y="12" width="2" height="2" fill="#fff" />
      </g>
    </svg>
  );
}
// 图二：像素 MP3 + 耳机线 + 小爱心，rect 拼
function PixelPlayer() {
  return (
    <svg viewBox="0 0 30 28" className="h-11 w-11" shapeRendering="crispEdges">
      {/* 耳机线 */}
      <path d="M19 2 h3 v4 M4 14 q-2 6 4 8 h12 q6 -1 5 -6" stroke="#1c1c22" strokeWidth="1.4" fill="none" />
      <rect x="21" y="15" width="3" height="5" fill="#1c1c22" /><rect x="24" y="16" width="3" height="5" fill="#1c1c22" />
      {/* 机身 */}
      <rect x="9" y="5" width="10" height="16" fill="#8f7ef0" />
      <rect x="9" y="5" width="10" height="1" fill="#3a3348" /><rect x="9" y="20" width="10" height="1" fill="#3a3348" /><rect x="9" y="5" width="1" height="16" fill="#3a3348" /><rect x="18" y="5" width="1" height="16" fill="#3a3348" />
      {/* 屏幕 */}
      <rect x="10" y="6" width="8" height="5" fill="#1c1c22" />
      <rect x="13" y="7" width="3" height="2" fill="#F7D752" /><rect x="11" y="8" width="1" height="1" fill="#8be9fd" />
      {/* 转盘 */}
      <rect x="11" y="12" width="6" height="6" fill="none" stroke="#1c1c22" strokeWidth="1" />
      <rect x="13" y="14" width="2" height="2" fill="#c9a6f2" stroke="#1c1c22" strokeWidth=".8" />
      <rect x="13" y="12" width="2" height="1" fill="#1c1c22" /><rect x="13" y="17" width="2" height="1" fill="#1c1c22" /><rect x="11" y="14" width="1" height="2" fill="#1c1c22" /><rect x="16" y="14" width="1" height="2" fill="#1c1c22" />
      {/* 小爱心 */}
      <rect x="5" y="12" width="2" height="2" fill="#F7D752" /><rect x="22" y="11" width="2" height="2" fill="#F7D752" /><rect x="7" y="5" width="2" height="2" fill="#F7D752" />
    </svg>
  );
}
export default function Charts() {
  const { songs, isDarkMode: d } = useRadio(); const nav = useNavigate();
  const sorted = [...songs].sort((a, b) => b.votes - a.votes);
  const top3 = sorted.slice(0, 3); const rest = sorted.slice(3);
  const medal = ['🥇', '🥈', '🥉'];
  const row = `flex cursor-pointer items-center gap-3 p-3 transition ${d ? 'hover:bg-white/10' : 'hover:bg-[#fff7e0]'}`;
  // 图三：黑体像素马赛克字——DotGothic16 + 粗描边 + 关闭平滑
  const pixFont = `'DotGothic16','Zpix','Press Start 2P',monospace`;
  const pixStyle = { fontFamily: pixFont, WebkitFontSmoothing: 'none', MozOsxFontSmoothing: 'unset', letterSpacing: '.18em', textShadow: '2px 0 0 currentColor' };
  return (
    <PageShell dark={d}>
      <style>{`${FONTS}@import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=ZCOOL+QingKe+HuangYou&display=swap');`}</style>
      <div className={`mx-auto mb-8 max-w-xl -rotate-1 rounded-xl border-[3px] px-6 py-5 text-center ${d ? 'border-[#8be9fd] bg-[#151b4d]' : 'border-[#2b1a4e] bg-[#E2883E] shadow-[6px_6px_0_#2b1a4e]'}`}>
        <h1 className={`font-['DotGothic16'] text-4xl tracking-[.15em] md:text-5xl ${d ? 'text-[#fff7e0]' : 'text-[#3D547A]'}`}>原创榜单</h1>
        <p className={`mt-2 font-['VT323'] text-2xl tracking-widest ${d ? 'text-[#ffb3c8]' : 'text-[#F7D752]'}`}>Music List · Stay Tuned ♥</p>
        <div className={`mt-2 flex justify-center gap-1 text-lg ${d ? '' : 'text-[#F7D752]'}`}>⭐⭐⭐⭐⭐</div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {top3.map((s, i) => (
          <div key={s.id} className={`rounded-xl border-[3px] p-4 text-center ${d ? 'border-[#8be9fd] bg-[#241a5e]' : 'border-[#2b1a4e] bg-white shadow-[5px_5px_0_#2b1a4e]'} ${i === 0 ? '-rotate-1 md:-mt-4' : i === 1 ? 'rotate-1' : '-rotate-1'}`}>
            <p className={`font-['Press_Start_2P'] text-[9px] ${d ? 'text-white' : ''}`}>{medal[i]} TOP {i + 1}</p>
            <img src={s.cover} onClick={() => nav(`/player/${s.id}`)} className={`mx-auto mt-3 h-24 w-24 cursor-pointer rounded-full object-cover transition hover:scale-105 ${d ? 'border-[3px] border-[#8be9fd]' : 'border-[3px] border-[#2b1a4e]'}`} alt="" />
            <h3 className={`mt-2 truncate font-['Noto_Sans_SC'] text-lg font-bold ${d ? 'text-white' : ''}`}>{s.title}</h3>
            <p className="truncate font-['VT323'] text-xl text-[#c084fc]">{s.author} · {s.school}</p>
            <div className={`mx-auto mt-2 inline-block rounded-lg border-[3px] px-4 py-1 font-['Press_Start_2P'] text-[10px] ${d ? 'border-[#ffe45e] bg-[#151b4d] text-[#ffe45e]' : 'border-[#2b1a4e] bg-[#fff3a6]'}`}>♥ {s.votes} 票</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Win dark={d} title="" bar="bg-[#8be9fd]" body={d ? 'bg-[#151b4d] text-cyan-50' : 'bg-white'} rightIcon={<PixelCD />}>
          <div className="divide-y-2 divide-dashed divide-[#d9d3ea]">
            {rest.filter((_, i) => i % 2 === 0).map((s, k) => (
              <div key={s.id} onClick={() => nav(`/player/${s.id}`)} className={row}>
                <span className="w-8 font-['VT323'] text-2xl">{k * 2 + 4}.</span>
                <img src={s.cover} className="h-11 w-11 rounded object-cover" alt="" />
                <div className="min-w-0 flex-1"><p className="truncate font-['Noto_Sans_SC'] font-bold">{s.title}</p><p className="truncate font-['VT323'] text-xl opacity-60">{s.author}</p></div>
                <span className="font-['Press_Start_2P'] text-[9px]">♥{s.votes}</span>
              </div>
            ))}
            {rest.length === 0 && <p className="p-6 text-center font-['VT323'] text-2xl opacity-50">歌曲未完待续 / 持续更新中...</p>}
          </div>
        </Win>
        <Win dark={d} title="" bar="bg-[#fff3a6]" body={d ? 'bg-[#151b4d] text-cyan-50' : 'bg-white'} rightIcon={<PixelPlayer />}>
          <div className="divide-y-2 divide-dashed divide-[#e8d9b8]">
            {rest.filter((_, i) => i % 2 === 1).map((s, k) => (
              <div key={s.id} onClick={() => nav(`/player/${s.id}`)} className={row}>
                <span className="w-8 font-['VT323'] text-2xl">{k * 2 + 5}.</span>
                <img src={s.cover} className="h-11 w-11 rounded object-cover" alt="" />
                <div className="min-w-0 flex-1"><p className="truncate font-['Noto_Sans_SC'] font-bold">{s.title}</p><p className="truncate font-['VT323'] text-xl opacity-60">{s.author}</p></div>
                <span className="font-['Press_Start_2P'] text-[9px]">♥{s.votes}</span>
              </div>
            ))}
            {rest.length === 0 && <p className="p-6 text-center font-['VT323'] text-2xl opacity-50">虚位以待，等你上榜 ♡</p>}
          </div>
        </Win>
      </div>
      <p className={`mt-8 text-center font-['DotGothic16'] text-2xl md:text-3xl ${d ? 'text-[#ffe45e]' : 'text-[#3D547A]'}`}>✦ More Tracks Loading...未完待续</p>
    </PageShell>
  );
}
