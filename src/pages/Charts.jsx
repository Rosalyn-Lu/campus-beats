import { useRadio } from '../context/RadioContext';
import { Trophy, Medal } from 'lucide-react';

export default function Charts() {
  const { songs } = useRadio();
  const sortedSongs = [...songs].sort((a, b) => b.votes - a.votes);
  const top3 = sortedSongs.slice(0, 3);
  const rest = sortedSongs.slice(3);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="text-yellow-400" size={24} />;
    if (index === 1) return <Medal className="text-slate-300" size={24} />;
    if (index === 2) return <Medal className="text-amber-500" size={24} />;
    return <span className="text-slate-400 font-bold w-6 text-center text-lg">{index + 1}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2 tracking-wide">月度原创榜单</h1>
        <p className="text-slate-400 text-sm">根据听众投票实时更新，看看谁是这个月的校园之星。</p>
      </div>

      {/* 前三名 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {top3.map((song, index) => (
          <div key={song.id} className={`relative bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 border text-center transition-all duration-500 hover:-translate-y-1 ${
            index === 0 ? 'border-yellow-200 shadow-[0_0_30px_rgba(250,204,21,0.15)] md:-mt-4' : 
            index === 1 ? 'border-slate-200 shadow-[0_0_20px_rgba(148,163,184,0.1)]' :
            'border-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
          }`}>
            <div className="absolute top-4 left-4">{getRankIcon(index)}</div>
            <img src={song.cover} alt={song.title} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white/80 shadow-sm mb-4" />
            <h3 className="text-lg font-bold text-slate-700 truncate">{song.title}</h3>
            <p className="text-sm text-purple-400 mb-1">{song.author}</p>
            <p className="text-xs text-slate-400 mb-3">{song.school}</p>
            <div className="text-2xl font-bold text-indigo-500">{song.votes} <span className="text-sm font-normal text-slate-400">票</span></div>
          </div>
        ))}
      </div>

      {/* 其余排名 */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {rest.map((song, index) => (
          <div key={song.id} className="flex items-center gap-4 p-4 border-b border-slate-100/50 hover:bg-white/70 transition duration-300 last:border-0">
            <div className="w-8 flex justify-center">{getRankIcon(index + 3)}</div>
            <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
            <div className="flex-1 min-w-0">
              <h4 className="text-slate-700 font-medium truncate">{song.title}</h4>
              <p className="text-xs text-slate-400 truncate">{song.author} · {song.school}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-indigo-400">{song.votes}</div>
              <div className="text-xs text-slate-400">票</div>
            </div>
          </div>
        ))}
        {rest.length === 0 && (
          <div className="p-8 text-center text-slate-400">暂无更多作品</div>
        )}
      </div>
    </div>
  );
}