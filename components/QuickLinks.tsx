
import React, { useState } from 'react';

interface QuickLinksProps {
  onAddLink: (url: string, title: string) => void;
  existingLinksCount: number;
}

const QuickLinks: React.FC<QuickLinksProps> = ({ onAddLink, existingLinksCount }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;
    
    onAddLink(url.trim(), title.trim());
    setUrl('');
    setTitle('');
  };

  const presets = [
    { title: 'Google', url: 'google.com' },
    { title: 'YouTube', url: 'youtube.com' },
    { title: 'SVT Play', url: 'svtplay.se' },
    { title: 'Wikipedia', url: 'wikipedia.org' },
    { title: 'Classroom', url: 'classroom.google.com' },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pt-6 px-6">
      <div className="mb-6 flex justify-between items-end px-1">
          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{existingLinksCount}/5 använda</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skapa ny widget</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 mb-8">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Namn på widget</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="T.ex. Matematik" className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold bg-white" />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Webbadress</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="google.se" className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold bg-white" />
        </div>
        <button type="submit" disabled={existingLinksCount >= 5 || !url.trim() || !title.trim()} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 shadow-xl transition-all disabled:opacity-30 active:scale-95">Skapa Länk-Widget +</button>
      </form>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 opacity-60">Färdiga genvägar</h4>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button key={p.url} onClick={() => { setUrl(p.url); setTitle(p.title); }} className="px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-200 hover:text-indigo-600 transition-all text-left flex items-center gap-2">
              <span className="opacity-40">🔗</span> {p.title}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-auto pb-6 text-[9px] text-slate-400 italic text-center opacity-50">Länkarna visas som egna små fönster på arbetsytan.</p>
    </div>
  );
};

export default QuickLinks;
