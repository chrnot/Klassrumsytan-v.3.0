
import React, { useState, useEffect } from 'react';

const TwoStarsAndAWish: React.FC = () => {
  const [star1, setStar1] = useState(() => localStorage.getItem('kp_sw_star1') || '');
  const [star2, setStar2] = useState(() => localStorage.getItem('kp_sw_star2') || '');
  const [wish, setWish] = useState(() => localStorage.getItem('kp_sw_wish') || '');
  const [isPresenting, setIsPresenting] = useState(false);

  useEffect(() => {
    localStorage.setItem('kp_sw_star1', star1);
    localStorage.setItem('kp_sw_star2', star2);
    localStorage.setItem('kp_sw_wish', wish);
  }, [star1, star2, wish]);

  const clearAll = () => {
    if (confirm("Vill du rensa all feedback?")) {
      setStar1(''); setStar2(''); setWish(''); setIsPresenting(false);
    }
  };

  if (isPresenting) {
    return (
      <div className="flex flex-col h-full bg-white animate-in zoom-in-95 duration-500 overflow-y-auto custom-scrollbar">
        <div className="flex-1 p-6 md:p-10 space-y-8">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-[3rem] p-8 shadow-xl shadow-amber-100/50 animate-in slide-in-from-left-8 duration-500 delay-100">
            <div className="flex items-start gap-6"><span className="text-6xl md:text-7xl animate-bounce duration-[3s]">⭐</span><div><span className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em] block mb-2">Stjärna 1</span><p className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">{star1 || "..."}</p></div></div>
          </div>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-[3rem] p-8 shadow-xl shadow-amber-100/50 animate-in slide-in-from-right-8 duration-500 delay-300">
            <div className="flex items-start gap-6"><span className="text-6xl md:text-7xl animate-bounce duration-[3s] [animation-delay:0.5s]">⭐</span><div><span className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em] block mb-2">Stjärna 2</span><p className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">{star2 || "..."}</p></div></div>
          </div>
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[3rem] p-8 shadow-xl shadow-indigo-100/50 animate-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="flex items-start gap-6"><span className="text-6xl md:text-7xl">✨</span><div><span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.3em] block mb-2">Önskan</span><p className="text-2xl md:text-4xl font-black text-indigo-900 leading-tight">{wish || "..."}</p></div></div>
          </div>
        </div>
        <footer className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
          <button onClick={() => setIsPresenting(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors tracking-widest">← Redigera text</button>
          <button onClick={clearAll} className="text-[10px] font-black uppercase text-red-400 hover:text-red-600 transition-colors tracking-widest">Töm allt 🗑️</button>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500 pt-10 px-10 overflow-y-auto custom-scrollbar">
      <div className="flex-1 space-y-6">
        <div className="space-y-2"><label className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 tracking-widest ml-1"><span>⭐</span> Stjärna 1 (Bra insats)</label><textarea value={star1} onChange={(e) => setStar1(e.target.value)} placeholder="Vad var bra?" className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-400 min-h-[100px] resize-none transition-all shadow-inner" /></div>
        <div className="space-y-2"><label className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 tracking-widest ml-1"><span>⭐</span> Stjärna 2 (Vad mer var bra?)</label><textarea value={star2} onChange={(e) => setStar2(e.target.value)} placeholder="Något mer?" className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-400 min-h-[100px] resize-none transition-all shadow-inner" /></div>
        <div className="space-y-2"><label className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-500 tracking-widest ml-1"><span>✨</span> En önskan (Förbättring)</label><textarea value={wish} onChange={(e) => setWish(e.target.value)} placeholder="Vad kan bli bättre?" className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-bold text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-400 min-h-[100px] resize-none transition-all shadow-inner" /></div>
      </div>
      <div className="py-10 shrink-0">
        <button onClick={() => setIsPresenting(true)} disabled={!star1 && !star2 && !wish} className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-30">Skapa Feedback-kort 🚀</button>
      </div>
    </div>
  );
};

export default TwoStarsAndAWish;
