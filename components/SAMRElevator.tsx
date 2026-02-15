
import React, { useState } from 'react';

type SAMRLevel = 'S' | 'A' | 'M' | 'R';

interface SAMRStepData {
  title: string;
  icon: string;
  color: string;
  borderColor: string;
  lightColor: string;
  definition: string;
  question: string;
  examples: string[];
}

const LEVEL_DATA: Record<SAMRLevel, SAMRStepData> = {
  R: {
    title: 'Redefinition',
    icon: '🚀',
    color: 'bg-emerald-600',
    borderColor: 'border-emerald-500',
    lightColor: 'bg-emerald-50',
    definition: 'Tekniken skapar nya uppgifter som tidigare var omöjliga att genomföra.',
    question: 'Når vi utanför klassrummets väggar? Skapar vi något helt unikt?',
    examples: [
      'Publicera globalt för riktig publik',
      'Live-samtal med experter/andra klasser',
      'Skapa interaktiva AR/VR-miljöer',
      'AI-drivna simuleringar'
    ]
  },
  M: {
    title: 'Modification',
    icon: '🛠️',
    color: 'bg-emerald-400',
    borderColor: 'border-emerald-300',
    lightColor: 'bg-emerald-50/50',
    definition: 'Tekniken möjliggör en betydande omdesign av den pedagogiska uppgiften.',
    question: 'Samarbetar eleverna på nya sätt? Är uppgiften radikalt förändrad?',
    examples: [
      'Samskrivande med realtidsrespons',
      'Multimedia-produktioner (ljud/bild/text)',
      'Digitaler tidslinjer eller storymaps',
      'Datavisualisering'
    ]
  },
  A: {
    title: 'Augmentation',
    icon: '⚡',
    color: 'bg-blue-600',
    borderColor: 'border-blue-500',
    lightColor: 'bg-blue-50',
    definition: 'Tekniken fungerar som ett substitut med funktionella förbättringar.',
    question: 'Går det snabbare? Får eleverna bättre feedback via tekniken?',
    examples: [
      'Självrättande quiz / Kahoot',
      'Digital rättstavning & ordböcker',
      'Delning via molntjänst (Drive/Teams)',
      'Sökbarhet i texter'
    ]
  },
  S: {
    title: 'Substitution',
    icon: '📄',
    color: 'bg-blue-400',
    borderColor: 'border-blue-300',
    lightColor: 'bg-blue-50/50',
    definition: 'Tekniken ersätter ett analogt verktyg utan funktionell förändring.',
    question: 'Skulle detta kunna göras lika bra med papper och penna?',
    examples: [
      'Skriva text i Word istället för kollegieblock',
      'Läsa en PDF istället för en bok',
      'Titta på filmad genomgång',
      'Digital kalkylator'
    ]
  }
};

const RANDOM_R_IDEAS = [
  "Skapa en interaktiv dokumentärfilm",
  "Genomför ett videosamtal med en expert",
  "Publicera resultaten globalt",
  "AI-genererad debatt mellan historiska personer",
  "Bygg en virtuell 3D-utställning",
  "Starta en podcast-serie för skolan",
  "Simulera vetenskapliga fenomen digitalt"
];

const SAMRElevator: React.FC = () => {
  const [baseIdea, setBaseIdea] = useState('');
  const [expandedLevel, setExpandedLevel] = useState<SAMRLevel | null>(null);
  const [refinements, setRefinements] = useState<Record<SAMRLevel, string>>({
    S: '', A: '', M: '', R: ''
  });
  const [randomIdea, setRandomIdea] = useState('');

  const toggleLevel = (level: SAMRLevel) => {
    setExpandedLevel(expandedLevel === level ? null : level);
  };

  const updateRefinement = (level: SAMRLevel, value: string) => {
    setRefinements(prev => ({ ...prev, [level]: value }));
  };

  const generateRandomIdea = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idea = RANDOM_R_IDEAS[Math.floor(Math.random() * RANDOM_R_IDEAS.length)];
    setRandomIdea(idea);
  };

  const levels: SAMRLevel[] = ['R', 'M', 'A', 'S'];

  return (
    <div className="flex flex-col h-full bg-slate-50 select-none overflow-hidden font-sans">
      {/* SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        
        {/* ELEVATOR STACK (Top to Bottom) */}
        <div className="flex flex-col gap-2">
          {levels.map((level, idx) => {
            const data = LEVEL_DATA[level];
            const isExpanded = expandedLevel === level;
            const hasContent = refinements[level].trim().length > 0;
            const isDimmed = expandedLevel !== null && !isExpanded;

            return (
              <React.Fragment key={level}>
                {/* THRESHOLD DIVIDER */}
                {level === 'A' && (
                  <div className="py-4 flex items-center justify-center relative">
                    <div className="absolute inset-x-0 h-[1px] bg-slate-200 border-t-2 border-dashed border-slate-300"></div>
                    <div className="relative bg-slate-50 px-4 flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Tröskeln till nytt lärande</span>
                      <span className="text-xs">✨</span>
                    </div>
                  </div>
                )}

                <div 
                  className={`transition-all duration-500 rounded-[1.5rem] border-2 shadow-sm overflow-hidden ${isExpanded ? 'ring-4 ring-indigo-500/10' : ''} ${isDimmed ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'} ${isExpanded ? 'bg-white border-slate-200' : `${data.color} ${data.borderColor}`}`}
                >
                  <button 
                    onClick={() => toggleLevel(level)}
                    className={`w-full flex items-center justify-between p-4 md:p-5 text-left transition-all ${isExpanded ? 'bg-slate-50' : 'hover:brightness-110'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${isExpanded ? data.color : 'bg-white/20'}`}>
                        {data.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isExpanded ? 'text-slate-400' : 'text-white/70'}`}>Våning {4 - idx}</span>
                          {hasContent && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </div>
                        <h3 className={`font-black text-sm uppercase tracking-wider ${isExpanded ? 'text-slate-800' : 'text-white'}`}>{data.title}</h3>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-indigo-600 text-white rotate-180' : 'bg-white/10 text-white'}`}>
                      ▼
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 space-y-5 animate-in slide-in-from-top-4 duration-300">
                      {/* DEFINITION & QUESTION */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Definition</p>
                          <p className="text-xs font-bold text-slate-600 leading-relaxed">{data.definition}</p>
                        </div>
                        <div className={`${data.lightColor} p-4 rounded-2xl border-2 border-white shadow-sm`}>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Reflektionsfråga</p>
                          <p className="text-sm font-black text-slate-800 leading-tight italic">"{data.question}"</p>
                        </div>
                      </div>

                      {/* EXAMPLES */}
                      <div className="px-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Inspiration & Exempel:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {data.examples.map((ex, i) => (
                            <div key={i} className="flex items-start gap-2 text-[10px] font-medium text-slate-500 bg-slate-50 p-2 rounded-lg">
                              <span className="text-indigo-400">•</span> {ex}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* RANDOM BOOSTER FOR R */}
                      {level === 'R' && (
                        <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg relative overflow-hidden group">
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">R-Generator 🪄</p>
                              <button 
                                onClick={generateRandomIdea}
                                className="bg-white text-indigo-600 text-[8px] font-black px-3 py-1 rounded-full shadow-sm hover:bg-indigo-50 active:scale-95 transition-all"
                              >
                                SLUMPA IDÉ
                              </button>
                            </div>
                            {randomIdea ? (
                              <p className="text-xs font-black italic animate-in fade-in slide-in-from-left-2">"{randomIdea}"</p>
                            ) : (
                              <p className="text-[10px] font-medium opacity-70">Få hjälp att nå den högsta nivån...</p>
                            )}
                          </div>
                          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                        </div>
                      )}

                      {/* INPUT AREA */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Din plan för denna nivå:</label>
                        <textarea
                          value={refinements[level]}
                          onChange={(e) => updateRefinement(level, e.target.value)}
                          placeholder={`Hur ser uppgiften ut på ${data.title}-nivån?`}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all resize-none h-24"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* FUNDAMENT / GRUNDIDÉ */}
        <div className="pt-6">
          <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-6 shadow-sm relative">
            <div className="absolute -top-3 left-8 bg-slate-800 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              🏠 Fundamentet / Grundidén
            </div>
            <textarea
              value={baseIdea}
              onChange={(e) => setBaseIdea(e.target.value)}
              placeholder="Vad vill du att eleverna ska göra? (Analoga grunden)"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-slate-100 transition-all resize-none h-28"
            />
            <p className="mt-3 text-[9px] text-slate-400 font-medium px-1">
              Börja här. Beskriv din uppgift utan teknik, t.ex: "Skriva en berättelse om en resa."
            </p>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="shrink-0 px-6 py-4 bg-white border-t border-slate-100 flex justify-between items-center no-drag">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Puentedura Model</span>
        </div>
        <div className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Hiss v2.0
        </div>
      </footer>
    </div>
  );
};

export default SAMRElevator;
