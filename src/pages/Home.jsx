// src/pages/Home.jsx
import { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { Play, Pause, ThumbsUp } from 'lucide-react';

export default function Home() {
  const { songs, hasVoted, vote } = useRadio();
  const [playingId, setPlayingId] = useState(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400 bg-clip-text text-transparent mb-4 tracking-wide">
          校园原创电台 · 盲听投票
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
          隐藏作者信息，只用耳朵投票。为你喜欢的原创音乐投出一票，投票后即可揭晓作者与学校。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song) => {
          const voted = hasVoted(song.id);
          const isPlaying = playingId === song.id;

          return (
            <div key={song.id} className="bg-white/70 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/80 hover:border-purple-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.1)] transition-all duration-500 group">
              {/* 封面 */}
              <div className="relative aspect-square overflow-hidden m-3 rounded-2xl">
                <img src={song.cover} alt="cover" className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <button 
                  onClick={() => setPlayingId(isPlaying ? null : song.id)}
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-indigo-400 shadow-lg hover:scale-110 transition-all duration-300"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </button>
              </div>

              {/* 信息 */}
              <div className="px-5 pb-5">
                <h3 className="text-xl font-bold text-slate-700 mb-2">{song.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {song.genre.map((g) => (
                    <span key={g} className="px-3 py-1 bg-gradient-to-r from-sky-50 to-indigo-50 text-indigo-400 text-xs rounded-full border border-indigo-100">{g}</span>
                  ))}
                </div>

                {/* 投票区域 */}
                {voted ? (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 text-center border border-purple-100">
                    <p className="text-purple-500 text-sm font-medium">✨ 已推荐</p>
                    <p className="text-slate-500 text-xs mt-1">
                      来自 <span className="text-indigo-500 font-medium">{song.school}</span> 的 <span className="text-purple-500 font-medium">{song.author}</span>
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => vote(song.id)}
                    disabled={!isPlaying}
                    className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all duration-300 ${
                      isPlaying
                        ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ThumbsUp size={18} />
                    {isPlaying ? '推荐这首' : '播放后即可推荐'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}