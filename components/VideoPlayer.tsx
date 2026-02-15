
import React, { useState } from 'react';

const VideoPlayer: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [videoData, setVideoData] = useState<{ type: 'youtube' | null, src: string }>({ type: null, src: '' });

  const handleSumbit = (e: React.FormEvent) => {
    e.preventDefault();
    const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/;
    const ytMatch = inputUrl.match(ytRegex);
    if (ytMatch && ytMatch[1]) setVideoData({ type: 'youtube', src: ytMatch[1] });
    else alert("Kunde inte tolka länken.");
  };

  if (videoData.type) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoData.src}?autoplay=1`} frameBorder="0" allowFullScreen />
          <button onClick={() => setVideoData({ type: null, src: '' })} className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-slate-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase backdrop-blur-md transition-all opacity-0 group-hover:opacity-100">Byt video</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="text-8xl opacity-10">🎬</div>
        <p className="text-slate-500 text-sm font-medium">Klistra in en YouTube-länk för distraktionsfri visning.</p>
        <form onSubmit={handleSumbit} className="flex flex-col gap-3">
          <input type="text" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} placeholder="YouTube-länk..." className="w-full px-6 py-5 rounded-[2rem] border border-slate-200 outline-none bg-slate-50 font-bold" />
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Starta Film</button>
        </form>
      </div>
    </div>
  );
};

export default VideoPlayer;
