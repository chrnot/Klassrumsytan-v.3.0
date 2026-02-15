
import React, { useState } from 'react';

const TrafficLight: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const modes = [
    { id: 'red', icon: '🔴', label: 'Stopp / Lyssna', color: 'bg-red-500', focusBg: 'bg-red-50/50' },
    { id: 'yellow', icon: '🟡', label: 'Vänta / Gör klart', color: 'bg-amber-400', focusBg: 'bg-amber-50/50' },
    { id: 'green', icon: '🟢', label: 'Börja arbeta', color: 'bg-emerald-500', focusBg: 'bg-emerald-50/50' }
  ];

  const activeMode = modes.find(m => m.id === activeId);

  if (isMinimized && activeMode) {
    return (
      <div onClick={() => setIsMinimized(false)} className={`h-full flex flex-col items-center justify-center cursor-pointer p-8 rounded-[2rem] transition-all ${activeMode.focusBg}`}>
        <div className="text-[12rem] mb-8 animate-bounce">{activeMode.icon}</div>
        <h2 className={`text-6xl font-black text-center tracking-tight ${activeMode.id === 'red' ? 'text-red-600' : activeMode.id === 'yellow' ? 'text-amber-600' : 'text-emerald-600'}`}>{activeMode.label}</h2>
        <div className="absolute bottom-6 text-[10px] font-black uppercase text-slate-400">Klicka för att ändra</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in h-full pt-6 px-6">
      <header className="flex justify-end gap-2 shrink-0">
          {activeId && <button onClick={() => setActiveId(null)} className="bg-slate-100 text-slate-400 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase">Av</button>}
      </header>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-slate-800 p-6 rounded-[4rem] shadow-xl flex flex-col gap-6 border-4 border-slate-700 w-fit">
          {modes.map((m) => (
            <button key={m.id} onClick={() => { setActiveId(m.id); setIsMinimized(true); }} className={`w-24 h-24 rounded-full transition-all flex items-center justify-center text-5xl ${activeId === m.id ? `${m.color} shadow-lg scale-110` : 'bg-slate-900 opacity-20'}`}><span>{m.icon}</span></button>
          ))}
        </div>
      </div>
      <p className="pb-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">Klicka på en färg för att visa stort</p>
    </div>
  );
};

export default TrafficLight;
