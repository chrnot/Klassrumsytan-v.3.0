
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
    setUrl(''); setTitle('');
  };

  return (
    <div className="flex flex-col h-full pt-6 px-6">
      <div className="mb-6 flex justify-between items-end"><span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{existingLinksCount}/5 använda</span><span className="text-[9px] font-black text-slate-400 uppercase">Skapa ny widget</span></div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 mb-8">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="T.ex. Matematik" className="w-full px-5 py-3 rounded-2xl border border-slate-200 text-sm font-bold bg-white" />
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="google.se" className="w-full px-5 py-3 rounded-2xl border border-slate-200 text-sm font-bold bg-white" />
        <button type="submit" disabled={existingLinksCount >= 5 || !url.trim() || !title.trim()} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl disabled:opacity-30">Skapa Länk-Widget +</button>
      </form>
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">Färdiga genvägar</h4>
        <div className="grid grid-cols-2 gap-2">
          {[{ title: 'Google', url: 'google.com' }, { title: 'YouTube', url: 'youtube.com' }].map((p) => (
            <button key={p.url} onClick={() => { setUrl(p.url); setTitle(p.title); }} className="px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-indigo-600 text-left flex items-center gap-2"><span className="opacity-40">🔗</span> {p.title}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
