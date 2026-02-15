
import React, { useRef, useState } from 'react';

const PRESETS = [
  { id: 'slate', value: 'bg-slate-100', label: 'Stilren', icon: '🎨' },
  { id: 'grid', value: 'bg-pattern-grid', label: 'Rutor', icon: '🟦' },
  { id: 'lines', value: 'bg-pattern-lines', label: 'Linjerat', icon: '🗒️' },
  { id: 'dots', value: 'bg-pattern-dots', label: 'Prickat', icon: '⁙' },
  { id: 'ocean', value: 'bg-[url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2560")] bg-cover', label: 'Hav', icon: '🌊' },
  { id: 'classroom', value: 'bg-[url("https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2560")] bg-cover', label: 'Skola', icon: '🏫' },
  { id: 'forest', value: 'bg-[url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2560")] bg-cover', label: 'Skog', icon: '🌲' },
  { id: 'library', value: 'bg-[url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=2560")] bg-cover', label: 'Böcker', icon: '📚' },
];

interface BackgroundSelectorProps {
  current: string;
  onSelect: (bg: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ current, onSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const result = readerEvent.target?.result as string;
        onSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelect(customUrl.trim());
      setCustomUrl('');
    }
  };

  const renderPreset = (bg: typeof PRESETS[0]) => (
    <button
      key={bg.id}
      onClick={() => onSelect(bg.value)}
      className={`w-full h-14 rounded-xl border-2 transition-all overflow-hidden relative group flex flex-col items-center justify-center gap-0.5 ${
        current === bg.value 
          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10 shadow-sm z-10' 
          : 'border-slate-100 bg-white hover:border-slate-300'
      }`}
    >
      <div className={`absolute inset-0 opacity-20 pointer-events-none ${bg.value.includes('bg-') ? bg.value : ''}`} />
      <span className="text-xl relative z-10 group-hover:scale-110 transition-transform">{bg.icon}</span>
      <span className="text-[7px] font-black uppercase tracking-tight text-slate-500 relative z-10 text-center px-1 whitespace-nowrap leading-none">{bg.label}</span>
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Papper & Miljöer</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1">
          {PRESETS.map(renderPreset)}
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Anpassat</h4>
        <div className="grid grid-cols-2 gap-2 p-1">
          <div className="w-full h-12 rounded-xl border-2 border-slate-100 bg-white flex items-center justify-center relative group overflow-hidden transition-all hover:border-slate-300 shadow-sm">
            <input 
              type="color" 
              value={current.startsWith('#') ? current : '#ffffff'}
              onChange={(e) => onSelect(e.target.value)}
              className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
            />
            <div className="flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Färg</span>
            </div>
          </div>

          <button
            onClick={() => setShowCustom(!showCustom)}
            className={`w-full h-12 rounded-xl border-2 border-slate-100 bg-white flex items-center justify-center relative transition-all shadow-sm ${showCustom ? 'bg-indigo-50 border-indigo-200' : 'hover:border-slate-300'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🖼️</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Ladda Upp</span>
            </div>
          </button>
        </div>
      </div>

      {showCustom && (
        <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-[2rem] animate-in slide-in-from-top-2 duration-200 border border-slate-100">
          <div className="w-full">
            <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Klistra in Bild-URL</label>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-4 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Spara</button>
            </form>
          </div>
          
          <div className="w-full">
            <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Eller välj fil</label>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              Välj bild...
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundSelector;
