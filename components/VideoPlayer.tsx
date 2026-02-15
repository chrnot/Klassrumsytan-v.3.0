
import React, { useState } from 'react';

const VideoPlayer: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [videoData, setVideoData] = useState<{ type: 'youtube' | 'direct' | null, src: string }>({ type: null, src: '' });

  const parseVideoUrl = (url: string) => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/;
    const ytMatch = trimmedUrl.match(ytRegex);
    const isDirectId = /^[a-zA-Z0-9_-]{11}$/.test(trimmedUrl);
    const directRegex = /\.(mp4|webm|ogg)$/i;
    if (isDirectId) setVideoData({ type: 'youtube', src: trimmedUrl });
    else if (ytMatch && ytMatch[1]) setVideoData({ type: 'youtube', src: ytMatch[1] });
    else if (directRegex.test(trimmedUrl)) setVideoData({ type: 'direct', src: trimmedUrl });
    else alert("Kunde inte tolka länken.");
  };

  const handleSumbit = (e: React.FormEvent) => { e.preventDefault(); parseVideoUrl(inputUrl); };
  const origin = window.location.origin;

  if (videoData.type) {
    return (
      <div className="flex flex-col h-full animate-in fade-in duration-500">
        <div className="flex-1 bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
          {videoData.type === 'youtube' ? (
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoData.src}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`} title="Video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          ) : (
            <video className="w-full h-full" controls autoPlay src={videoData.src} />
          )}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
            <button onClick={() => setVideoData({ type: null, src: '' })} className="bg-white/20 hover:bg-white/90 text-white hover:text-slate-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase backdrop-blur-md transition-all shadow-lg">🔄 Byt video</button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between px-6 pb-4">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">ID: {videoData.src}</span>
            <p className="text-[9px] text-slate-400 italic text-right opacity-50">Om videon ej laddas kan inbäddning vara blockerad.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="text-8xl mb-4 opacity-10">🎬</div>
        <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">Klistra in en YouTube-länk för att visa klippet utan distraktionsmoment.</p>
        <form onSubmit={handleSumbit} className="flex flex-col gap-3">
          <input type="text" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} placeholder="Klistra in YouTube-länk..." className="w-full px-6 py-5 rounded-3xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner text-sm font-bold transition-all bg-slate-50" />
          <button type="submit" disabled={!inputUrl.trim()} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 shadow-xl transition-all active:scale-95 disabled:opacity-40">Starta Film 🎞️</button>
        </form>
      </div>
    </div>
  );
};

export default VideoPlayer;
