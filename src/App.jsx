// src/App.jsx
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { RadioProvider } from './context/RadioContext';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Charts from './pages/Charts';
import { Radio, Home as HomeIcon, UploadCloud, BarChart2 } from 'lucide-react';

function Navbar() {
  const navItems = [
    { path: '/', name: '盲听', icon: <HomeIcon size={18} /> },
    { path: '/upload', name: '上传', icon: <UploadCloud size={18} /> },
    { path: '/charts', name: '榜单', icon: <BarChart2 size={18} /> },
  ];

  return (
    <>
      {/* 桌面端顶部导航 */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-xl border-b border-purple-100/50 sticky top-0 z-50 shadow-[0_4px_20px_rgba(168,85,247,0.05)]">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl">
          <Radio size={24} /> 校园原创电台
        </div>
        <div className="flex gap-2">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} className={({isActive}) => `px-4 py-2 rounded-2xl flex items-center gap-2 transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-500 shadow-sm' : 'text-slate-400 hover:text-indigo-400 hover:bg-white/50'}`}>
              {item.icon} {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-purple-100/50 flex justify-around py-3 z-50 shadow-[0_-4px_20px_rgba(168,85,247,0.05)]">
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} className={({isActive}) => `flex flex-col items-center gap-1 text-xs transition-all duration-300 ${isActive ? 'text-indigo-400 font-medium' : 'text-slate-400'}`}>
            {item.icon} {item.name}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default function App() {
  return (
    <RadioProvider>
      <Router>
        <div className="min-h-screen relative font-sans text-slate-600 pb-20 md:pb-0">
          {/* 插入闪烁星星背景 */}
          <div className="stars-bg"></div>
          <div className="relative z-10">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/charts" element={<Charts />} />
            </Routes>
          </div>
        </div>
      </Router>
    </RadioProvider>
  );
}