
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
    { type: ToolType.LESSON_NAVIGATOR, title: 'Navigatör', desc: 'Lektionsstruktur.', icon: '🧭', color: 'bg-indigo-100 text-indigo-600' },
    { type: ToolType.CHECKLIST, title: 'Arbetsgång', desc: 'Planera moment.', icon: '✅', color: 'bg-emerald-100 text-emerald-600' },
    { type: ToolType.RANDOMIZER, title: 'Glasspinnar', desc: 'Slumpa elev.', icon: '🍦', color: 'bg-rose-100 text-rose-600' },
    { type: ToolType.STARS_WISH, title: 'Feedback', desc: 'Stjärnor & Önskan.', icon: '⭐', color: 'bg-amber-100 text-amber-600' },
    { type: ToolType.CONVERSATION_BUBBLES, title: 'Bubblan', desc: 'Samtalsstöd.', icon: '💬', color: 'bg-blue-100 text-blue-600' },
    { type: ToolType.TIMER, title: 'Timer', desc: 'Sätt fokus.', icon: '⏱️', color: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 flex flex-col">
      {/* 1. VÄLKOMMEN RUTA */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-8 md:p-12 rounded-[3.5rem] shadow-2xl text-center relative overflow-hidden w-full flex-grow-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/30 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/30 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl shadow-indigo-200 mx-auto mb-6 animate-bounce duration-[3000ms]">
            🏫
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight mb-4 leading-tight">
            Klassrums<span className="text-indigo-600">ytan</span>
          </h2>
          <p className="text-slate-500 text-base md:text-xl max-w-2xl mx-auto leading-relaxed opacity-80 font-medium">
            Ditt digitala skrivbord för en lugnare och mer strukturerad lektion. Allt du behöver, på ett och samma ställe.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 relative z-10">
          {cards.map((card) => (
            <button
              key={card.type}
              onClick={() => onSelectTool(card.type)}
              className="group flex flex-col items-center p-5 bg-white/40 border border-white/60 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-[2.5rem] w-full"
            >
              <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                {card.icon}
              </div>
              <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-wider mb-1">{card.title}</h3>
              <p className="text-slate-400 text-[8px] uppercase font-black tracking-widest opacity-60">{card.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Grid för Bakgrund och AI - Adaptiv höjd */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* 2. BAKGRUNDSRUTA */}
        <div className="bg-white/60 backdrop-blur-lg border border-white/40 p-8 rounded-[3.5rem] shadow-xl flex flex-col w-full min-h-[400px]">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <span className="text-3xl">🖼️</span> Miljö & Stämning
            </h3>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] bg-slate-100 px-3 py-1 rounded-full">Anpassa</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <BackgroundSelector current={currentBackground} onSelect={onBackgroundSelect} />
          </div>
        </div>

        {/* 3. AI RUTA */}
        <div className="bg-indigo-600 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 group flex flex-col w-full min-h-[400px] justify-center">
          <div className="relative z-10">
            <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">Pedagogisk AI</div>
            <h3 className="text-3xl md:text-4xl font-black mb-6 flex items-center gap-4">
              <span className="text-4xl animate-pulse">✨</span> 5-min Aktivitet
            </h3>
            <p className="text-indigo-100 text-lg md:text-xl mb-12 leading-relaxed font-medium">
              Behöver du bryta av? Generera en snabb aktivitet för dina {studentsCount > 0 ? studentsCount : 'elever'} elever direkt med vår AI-assistent.
            </p>
            <button 
              onClick={() => onSelectTool(ToolType.ASSISTANT)}
              className="bg-white text-indigo-600 px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all w-full sm:w-fit shadow-2xl shadow-black/10 group-hover:scale-105 active:scale-95"
            >
              Starta Assistenten 🚀
            </button>
          </div>
          {/* Dekoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-[0.03] rounded-full -mr-40 -mt-40 group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400 opacity-20 rounded-full -ml-20 -mb-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
