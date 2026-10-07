// src/pages/Upload.jsx
import { useState, useRef } from 'react';
import { useRadio } from '../context/RadioContext';
import { UploadCloud, Music, X } from 'lucide-react';

export default function Upload() {
  const { addSong } = useRadio();
  const [form, setForm] = useState({ title: '', genres: [], school: '', author: '' });
  const [audioFile, setAudioFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [success, setSuccess] = useState(false);

  const genresList = ['民谣', '摇滚', '电子', '流行', '嘻哈', '古典', '爵士', '氛围'];

  const handleGenreToggle = (genre) => {
    setForm(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : prev.genres.length < 3 ? [...prev.genres, genre] : prev.genres
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || form.genres.length === 0 || !form.school || !form.author || !audioFile) return;

    addSong({
      id: Date.now(),
      title: form.title,
      cover: `https://picsum.photos/seed/${Date.now()}/300/300`,
      genre: form.genres,
      school: form.school,
      author: form.author,
      votes: 0,
      audioUrl: preview,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setForm({ title: '', genres: [], school: '', author: '' });
      setAudioFile(null);
      setPreview(null);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-700 mb-2 tracking-wide">上传原创作品</h1>
      <p className="text-slate-400 mb-8 text-sm">分享你的音乐，让全校听见你的声音。</p>

      {success && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-500 px-4 py-3 rounded-2xl mb-6 shadow-sm">
          ✨ 作品上传成功！去首页看看你的作品吧。
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* 上传音频 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">音频文件 *</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${audioFile ? 'border-purple-300 bg-purple-50/50' : 'border-indigo-100 hover:border-indigo-200 hover:bg-white/50'}`}
          >
            {audioFile ? (
              <div className="flex items-center justify-center gap-3 text-indigo-400">
                <Music size={24} />
                <span className="text-sm truncate max-w-[200px] font-medium">{audioFile.name}</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); setAudioFile(null); setPreview(null); }} className="text-slate-400 hover:text-red-400 transition-colors"><X size={18} /></button>
              </div>
            ) : (
              <div className="text-slate-400">
                <UploadCloud size={40} className="mx-auto mb-3 text-indigo-300" />
                <p className="text-sm">点击或拖拽上传音频 (mp3, wav, m4a)</p>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
        </div>

        {/* 歌名和作者 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">歌名 *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 placeholder-slate-300 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50/50 transition-all duration-300" placeholder="给你的歌起个名字" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">作者昵称 *</label>
            <input type="text" value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 placeholder-slate-300 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50/50 transition-all duration-300" placeholder="你的名字或艺名" />
          </div>
        </div>

        {/* 学校 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">学校信息 *</label>
          <input type="text" value={form.school} onChange={(e) => setForm({...form, school: e.target.value})} className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 placeholder-slate-300 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50/50 transition-all duration-300" placeholder="例如：中央音乐学院" />
        </div>

        {/* 风格标签 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">风格标签 (最多选 3 个) *</label>
          <div className="flex flex-wrap gap-2">
            {genresList.map(g => (
              <button
                type="button" key={g}
                onClick={() => handleGenreToggle(g)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  form.genres.includes(g)
                    ? 'bg-gradient-to-r from-indigo-300 to-purple-300 border-transparent text-white shadow-sm'
                    : 'bg-white/80 border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-400'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* 提交 */}
        <button
          type="submit"
          disabled={!form.title || form.genres.length === 0 || !form.school || !form.author || !audioFile}
          className="w-full py-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white font-bold rounded-2xl hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-lg shadow-indigo-200/50"
        >
          发布作品
        </button>
      </form>
    </div>
  );
}