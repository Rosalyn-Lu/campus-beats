import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { RadioProvider, useRadio } from './context/RadioContext';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Charts from './pages/Charts';
import Player from './pages/Player';
import { Home as H, UploadCloud, BarChart2, Moon, Sun } from 'lucide-react';
import { FONTS } from './theme';
function Layout() {
  const { isDarkMode: d, toggleTheme } = useRadio();
  const loc = useLocation();
  const hide = loc.pathname.startsWith('/player');
  useEffect(() => { document.body.className = d ? 'dark-mode' : 'light-mode'; }, [d]);
  const leftItems = [
    { p: '/', n: '盲听', i: <H size={15} strokeWidth={3} /> },
    { p: '/charts', n: '榜单', i: <BarChart2 size={15} strokeWidth={3} /> },
  ];
  const uploadItem = { p: '/upload', n: '上传', i: <UploadCloud size={15} strokeWidth={3} /> };
  return (
    <div className="min-h-screen font-['VT323']">
      <style>{FONTS}</style>
      {!hide && (
        <>
          <nav className={`sticky top-0 z-50 hidden border-b-[3px] backdrop-blur md:block ${d ? 'border-[#8be9fd] bg-[#0d1440]/95' : 'border-[#2b1a4e] bg-[#ffb3dd]/95'}`}>
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-2.5">
              {/* 最左边：书籍 + 音乐 logo */}
              <div className="flex shrink-0 items-center gap-2">
                <span className={`relative flex h-11 w-11 items-center justify-center rounded-full border-[3px] ${d ? 'border-[#ffe45e] bg-[#241a5e]' : 'border-[#2b1a4e] bg-white shadow-[3px_3px_0_#2b1a4e]'}`}>
                  <svg viewBox="0 0 44 44" className="h-9 w-9">
                    <circle cx="22" cy="22" r="19" fill="none" stroke="#b9a7ff" strokeWidth="1.6" strokeDasharray="2 3" />
                    <circle cx="22" cy="22" r="15.5" fill="#fff7d6" stroke="#2b1a4e" strokeWidth="1.8" />
                    <circle cx="22" cy="22" r="12.5" fill="none" stroke="#ffe45e" strokeWidth="1.4" />
                    <rect x="19" y="13" width="6" height="10" rx="3" fill="#b9a7ff" stroke="#2b1a4e" strokeWidth="1.5" />
                    <path d="M17.5 20.5 Q17.5 25 22 25 Q26.5 25 26.5 20.5 M22 25 v3 M19.5 29 h5" stroke="#2b1a4e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <path d="M20 15 h4 M20 17.5 h4 M20 20 h4" stroke="#2b1a4e" strokeWidth=".8" opacity=".6" />
                    <path d="M27 20 l1.5 -3 1.5 6 1.5 -4 1 2" stroke="#ff6aad" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                    <circle cx="12" cy="28" r="1.8" fill="#2b1a4e" />
                    <path d="M13.8 28 V21 l4 -1" stroke="#2b1a4e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                    <text x="29" y="14" fontSize="7" fill="#2b1a4e">♪</text>
                  </svg>
                  {/* 右下徽标已去掉，按需求移除 */}
                  <span className="hidden" />
                </span>
                <div className="leading-none">
                  <p className={`font-['Press_Start_2P'] text-[10px] ${d ? 'text-white' : 'text-[#2b1a4e]'}`}>CAMPUS BEATS</p>
                  <p className={`font-['Noto_Sans_SC'] text-sm font-bold ${d ? 'text-[#8be9fd]' : 'text-[#6b4fa0]'}`}>校园原创广播电台 ♪</p>
                </div>
              </div>
              <div className="flex gap-2">
                {leftItems.map((it) => (
                  <NavLink key={it.p} to={it.p} className={({ isActive }) => `flex items-center gap-1.5 rounded-lg border-[3px] px-4 py-1.5 font-['Press_Start_2P'] text-[10px] shadow-[3px_3px_0_rgba(0,0,0,.25)] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${isActive ? 'bg-[#ff6aad] text-white' : d ? 'border-[#8be9fd] bg-white/10 text-white' : 'border-[#2b1a4e] bg-white text-[#2b1a4e]'}`}>{it.i}{it.n}</NavLink>
                ))}
              </div>
              {/* 最右边：上传 + 深夜切换 */}
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <NavLink to={uploadItem.p} className={({ isActive }) => `flex items-center gap-1.5 rounded-lg border-[3px] px-4 py-1.5 font-['Press_Start_2P'] text-[10px] shadow-[3px_3px_0_rgba(0,0,0,.25)] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${isActive ? 'bg-[#ff6aad] text-white' : d ? 'border-[#ffe45e] bg-[#ffe45e] text-[#2b1a4e]' : 'border-[#2b1a4e] bg-[#ffe45e] text-[#2b1a4e]'}`}>{uploadItem.i}{uploadItem.n}</NavLink>
                <button onClick={toggleTheme} className={`flex items-center gap-2 rounded-lg border-[3px] px-3 py-1.5 font-['Press_Start_2P'] text-[10px] ${d ? 'border-[#ffe45e] bg-[#2e2a5e] text-[#ffe45e]' : 'border-[#2b1a4e] bg-[#2e2a5e] text-[#ffe45e]'}`}>
                  {d ? <Sun size={15} /> : <Moon size={15} />} {d ? '白天' : '深夜'}
                </button>
              </div>
            </div>
            <div className={`px-6 py-1 text-center text-xl ${d ? 'bg-[#ff6aad]/20 text-cyan-100' : 'bg-white/40 text-[#6b4fa0]'}`}>♪ now playing : star wave radio — FM 88.8 · {d ? '深夜霓虹场' : '粉蓝 arcade 场'} ♪</div>
          </nav>
          <nav className={`fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t-[3px] py-2 backdrop-blur md:hidden ${d ? 'border-[#8be9fd] bg-[#0d1440]/95' : 'border-[#2b1a4e] bg-[#ffb3dd]/95'}`}>
            {[...leftItems, uploadItem].map((it) => (
              <NavLink key={it.p} to={it.p} className={({ isActive }) => `flex flex-col items-center gap-0.5 rounded-lg border-2 px-4 py-1 text-xl ${isActive ? 'bg-[#ff6aad] text-white' : d ? 'text-white' : 'text-[#2b1a4e]'}`}>{it.i}<span className="font-['Noto_Sans_SC'] text-xs font-bold">{it.n}</span></NavLink>
            ))}
            <button onClick={toggleTheme} className="flex flex-col items-center px-4 text-xl">{d ? <Sun size={18} /> : <Moon size={18} />}<span className="font-['Noto_Sans_SC'] text-xs font-bold">模式</span></button>
          </nav>
        </>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/player/:id" element={<Player />} />
      </Routes>
    </div>
  );
}
export default function App() { return (<RadioProvider><Router><Layout /></Router></RadioProvider>); }
