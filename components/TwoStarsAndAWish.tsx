
import React, { useState } from 'react';

const TwoStarsAndAWish: React.FC = () => {
  const [star1, setStar1] = useState('');
  const [star2, setStar2] = useState('');
  const [wish, setWish] = useState('');
  const [isPresenting, setIsPresenting] = useState(false);

  if (isPresenting) {
    return (
      <div className="flex flex-col h-full bg-white p-10 space-y-8 overflow-y-auto">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[3rem] p-8 shadow-xl"><div className="flex gap-6"><span className="text-6xl">⭐</span><div><span className="text-[10px] font-black uppercase text-amber-500 mb-2 block">Stjärna 1</span><p className="text-3xl font-black text-slate-800">{star1 || "..."}</p></div></div></div>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[3rem] p-8 shadow-xl"><div className="flex gap-6"><span className="text-6xl">⭐</span><div><span className="text-[10px] font-black uppercase text-amber-500 mb-2 block">Stjärna 2</span><p className="text-3xl font-black text-slate-800">{star2 || "..."}</p></div></div></div>
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[3rem] p-8 shadow-xl"><div className="flex gap-6"><span className="text-6xl">✨</span><div><span className="text-[10px] font-black uppercase text-indigo-500 mb-2 block">Önskan</span><p className="text-3xl font-black text-indigo-900">{wish || "..."}</p></div></div></div>
        <button onClick={() => setIsPresenting(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors">← Redigera text</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white pt-10 px-10">
      <div className="space-y-6 flex-1">
        <textarea value={star1} onChange={(e) => setStar1(e.target.value)} placeholder="Stjärna 1 (Bra insats)" className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-400" />
        <textarea value={star2} onChange={(e) => setStar2(e.target.value)} placeholder="Stjärna 2 (Något mer)" className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-400" />
        <textarea value={wish} onChange={(e) => setWish(e.target.value)} placeholder="En önskan (Förbättring)" className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>
      <div className="py-10"><button onClick={() => setIsPresenting(true)} className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-xl">Skapa Feedback-kort 🚀</button></div>
    </div>
  );
};

export default TwoStarsAndAWish;
