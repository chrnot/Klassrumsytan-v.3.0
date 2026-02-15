
import React from 'react';
import { ToolType } from '../types';
import BackgroundSelector from './BackgroundSelector';

interface DashboardProps {
  onSelectTool: (tool: ToolType) => void;
  studentsCount: number;
  currentBackground: string;
  onBackgroundSelect: (bg: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool, studentsCount, currentBackground, onBackgroundSelect }) => {
  const cards = [
    { type: ToolType.LESSON_NAVIGATOR, title: 'Navigatör', desc: 'Struktur', icon: '🧭', color: 'bg-indigo-100 text-indigo-600' },
    { type: ToolType.CHECKLIST, title: 'Arbetsgång', desc: 'Moment', icon: '✅', color: 'bg-emerald-100 text-emerald-600' },
    { type: ToolType.RANDOMIZER, title: 'Slumpa', desc: 'Glasspinnar', icon: '🍦', color: 'bg-rose-100 text-rose-600' },
    { type: ToolType.STARS_WISH, title: 'Feedback', desc: 'Frayer', icon: '⭐', color: 'bg-amber-100 text-amber-600' },
    { type: ToolType.CONVERSATION_BUBBLES, title: 'Bubblan', desc: 'Samtal', icon: '💬', color: 'bg-blue-100 text-blue-600' },
    { type: ToolType.TIMER, title: 'Timer', desc: 'Fokus', icon: '⏱️', color: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-28">
      {/* 1. VÄLKOMMEN RUTA */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-6 md:p-10 rounded-[3rem] shadow-2xl text-center relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-100/30 rounded-full -mr-24 -mt-24 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-2xl shadow-indigo-200 mx-auto mb-4 animate-bounce duration-[3000ms]">
            🏫
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-2 leading-tight">
            Klassrums<span className="text-indigo-600">ytan</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-lg max-w-xl mx-auto leading-relaxed opacity-80 font-medium">
            Ditt digitala skrivbord för en lugnare och mer strukturerad lektion.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
          {cards.map((card) => (
            <button
              key={card.type}
              onClick={() => onSelectTool(card.type)}
              className="group flex flex-col items-center p-4 bg-white/40 border border-white/60 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] w-full"
            >
              <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                {card.icon}
              </div>
              <h3 className="font-black text-slate-800 text-[9px] uppercase tracking-wider mb-1">{card.title}</h3>
              <p className="text-slate-400 text-[7px] uppercase font-black tracking-widest opacity-60">{card.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. BAKGRUNDSRUTA - Nu i fullbredd för bättre överblick */}
      <div className="bg-white/60 backdrop-blur-lg border border-white/40 p-8 rounded-[3rem] shadow-xl flex flex-col w-full min-h-[300px]">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <span className="text-2xl">🖼️</span> Miljö & Stämning
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] bg-slate-100 px-4 py-1.5 rounded-full">Anpassa din arbetsyta</span>
          </div>
        </div>
        <div className="flex-1">
          <BackgroundSelector current={currentBackground} onSelect={onBackgroundSelect} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
