
import React, { useState, useMemo, useEffect, useRef } from 'react';

interface PollOption {
  id: string;
  label: string;
  icon: string;
  votes: number;
  color: string;
  desc?: string;
}

const MINDSET_OPTIONS: PollOption[] = [
  { id: 'panik', label: 'Panikzonen', icon: '🤯', votes: 0, color: 'bg-rose-500', desc: 'Det känns jättesvårt just nu.' },
  { id: 'lar', label: 'Lär-zonen', icon: '🌱', votes: 0, color: 'bg-emerald-500', desc: 'Utmanande men spännande!' },
  { id: 'komfort', label: 'Komfortzonen', icon: '🛋️', votes: 0, color: 'bg-indigo-500', desc: 'Det här kan jag redan.' }
];

const TEMPLATES = [
  { id: 'mindset', title: 'Känslo-Kollen', question: 'Hur känns det inför uppgiften?', type: 'mindset', options: MINDSET_OPTIONS },
  { id: 'true-false', title: 'Sant / Falskt', question: 'Är påståendet sant?', type: 'standard', options: [{ id: '1', label: 'Sant', icon: '✅', votes: 0, color: 'bg-emerald-500' }, { id: '2', label: 'Falskt', icon: '❌', votes: 0, color: 'bg-rose-500' }] },
  { id: 'feeling', title: 'Snabbkoll', question: 'Hur går det?', type: 'standard', options: [{ id: '1', label: 'Bra', icon: '😃', votes: 0, color: 'bg-emerald-500' }, { id: '2', label: 'Okej', icon: '😐', votes: 0, color: 'bg-amber-400' }, { id: '3', label: 'Svårt', icon: '😟', votes: 0, color: 'bg-rose-500' }] }
];

const API_BASE = 'https://api.restful-api.dev/objects';

const PollingTool: React.FC<{ initialType?: 'standard' | 'mindset' }> = ({ initialType = 'standard' }) => {
  const [pollType, setPollType] = useState<'standard' | 'mindset'>(initialType);
  const [phase, setPhase] = useState<'before' | 'after' | 'compare'>('before');
  const [question, setQuestion] = useState(initialType === 'mindset' ? TEMPLATES[0].question : TEMPLATES[2].question);
  const [options, setOptions] = useState<PollOption[]>(() => {
    const template = initialType === 'mindset' ? TEMPLATES[0] : TEMPLATES[2];
    return JSON.parse(JSON.stringify(template.options));
  });
  
  const [beforeVotes, setBeforeVotes] = useState<Record<string, number>>({ panik: 0, lar: 0, komfort: 0 });
  const [afterVotes, setAfterVotes] = useState<Record<string, number>>({ panik: 0, lar: 0, komfort: 0 });
  const [showResults, setShowResults] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const pollInterval = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const totalVotes = useMemo<number>(() => {
    if (pollType === 'mindset') {
      const votesObj = phase === 'after' ? afterVotes : beforeVotes;
      return (Object.values(votesObj) as number[]).reduce<number>((a, b) => a + b, 0);
    }
    return options.reduce<number>((acc, opt) => acc + opt.votes, 0);
  }, [options, pollType, phase, beforeVotes, afterVotes]);

  const startLiveSession = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(API_BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `KP_POLL_${Date.now()}`, data: { type: pollType, phase, question, options, beforeVotes, afterVotes, updatedAt: Date.now() } }) });
      const data = await response.json(); setSessionId(data.id); setIsLive(true); startPolling(data.id);
    } catch (err) { alert("Kunde inte starta live-session."); }
    finally { setIsSyncing(false); }
  };

  const startPolling = (id: string) => {
    if (pollInterval.current) clearInterval(pollInterval.current);
    pollInterval.current = window.setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/${id}`); if (!res.ok) return;
        const serverData = await res.json();
        const serverUpdatedAt = serverData.data?.updatedAt;
        if (typeof serverUpdatedAt === 'number' && serverUpdatedAt > lastUpdateRef.current) {
          if (pollType === 'mindset') { setBeforeVotes(serverData.data.beforeVotes || {}); setAfterVotes(serverData.data.afterVotes || {}); }
          else { setOptions(serverData.data.options || []); }
          lastUpdateRef.current = serverUpdatedAt;
        }
      } catch (e) {}
    }, 3000);
  };

  const syncState = async (updates: any) => {
    if (!sessionId) return; const now = Date.now(); lastUpdateRef.current = now;
    try { await fetch(`${API_BASE}/${sessionId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: "KP_POLL_ACTIVE", data: { type: pollType, phase, question, options, beforeVotes, afterVotes, ...updates, updatedAt: now } }) }); } catch (e) {}
  };

  const handlePhaseChange = (newPhase: 'before' | 'after' | 'compare') => {
    setPhase(newPhase); let newQ = question;
    if (newPhase === 'after' && pollType === 'mindset') newQ = "Hur känns det nu när vi är klara?";
    else if (newPhase === 'before' && pollType === 'mindset') newQ = "Hur känns det inför uppgiften?";
    setQuestion(newQ); if (isLive) syncState({ phase: newPhase, question: newQ });
  };

  const manualVote = (id: string) => {
    if (pollType === 'mindset') {
      const voteKey = phase === 'after' ? 'afterVotes' : 'beforeVotes';
      const current = phase === 'after' ? afterVotes : beforeVotes;
      const next = { ...current, [id]: (current[id] || 0) + 1 };
      if (phase === 'after') setAfterVotes(next); else setBeforeVotes(next);
      if (isLive) syncState({ [voteKey]: next });
    } else {
      const next = options.map(opt => opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt);
      setOptions(next); if (isLive) syncState({ options: next });
    }
  };

  const applyTemplate = (t: any) => {
    setPollType(t.type); setQuestion(t.question); setOptions(JSON.parse(JSON.stringify(t.options))); setPhase('before');
    if (t.type === 'mindset') { setBeforeVotes({ panik: 0, lar: 0, komfort: 0 }); setAfterVotes({ panik: 0, lar: 0, komfort: 0 }); }
    if (isLive) syncState({ type: t.type, question: t.question, options: t.options, phase: 'before' });
  };

  const shareLink = sessionId ? `${window.location.origin}${window.location.pathname}?join=${sessionId}` : '';

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500 overflow-y-auto custom-scrollbar pb-10 pt-6">
      <div className="flex items-center justify-end gap-2 px-6 mb-6 shrink-0 no-drag">
          {!isLive ? (
            <button onClick={startLiveSession} disabled={isSyncing} className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg transition-all">{isSyncing ? 'Ansluter...' : '🚀 Gå Live'}</button>
          ) : (
            <button onClick={() => { setIsLive(false); setSessionId(null); }} className="bg-red-50 text-red-500 border border-red-100 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase">🔴 Stoppa</button>
          )}
          <button onClick={() => setIsEditing(!isEditing)} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${isEditing ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:border-indigo-300'}`}>{isEditing ? 'Spara' : 'Inställningar'}</button>
      </div>

      {isLive && sessionId && (
        <div className="mb-6 mx-6 bg-slate-50 border border-slate-100 p-4 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(shareLink)}`} alt="QR" className="w-16 h-16 bg-white p-1 rounded-lg shadow-sm" />
          <div className="flex-1 min-w-0">
             <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Dela länk:</p>
             <div className="flex items-center gap-2"><code className="text-[10px] font-bold text-indigo-600 truncate bg-white px-2 py-1 rounded border">{shareLink}</code><button onClick={() => { navigator.clipboard.writeText(shareLink); alert("Kopierat!"); }} className="text-[9px] font-black text-indigo-500">KOPIERA</button></div>
          </div>
        </div>
      )}

      {pollType === 'mindset' && (
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 w-fit mx-auto shadow-inner">
          {[{ id: 'before', label: '1. Före' }, { id: 'after', label: '2. Efter' }, { id: 'compare', label: '3. Analys' }].map(p => (
            <button key={p.id} onClick={() => handlePhaseChange(p.id as any)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${phase === p.id ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{p.label}</button>
          ))}
        </div>
      )}

      {isEditing ? (
        <div className="px-6 space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mallar</label><div className="grid grid-cols-1 sm:grid-cols-3 gap-2">{TEMPLATES.map(t => (<button key={t.id} onClick={() => applyTemplate(t)} className={`p-3 border rounded-xl text-[10px] font-black uppercase transition-all ${pollType === t.type ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}>{t.title}</button>))}</div></div>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Huvudfråga</label><input type="text" value={question} onChange={(e) => { setQuestion(e.target.value); if(isLive) syncState({question: e.target.value}); }} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold outline-none" /></div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-6">
          {phase === 'compare' ? (
             <div className="w-full max-w-2xl mx-auto space-y-10 animate-in zoom-in-95"><div className="text-center"><h3 className="text-3xl font-black text-slate-800 mb-2">Analys 📈</h3><p className="text-slate-500 text-sm font-medium">Jämförelse av klassens mindset före och efter.</p></div><div className="space-y-8">{MINDSET_OPTIONS.map(opt => { const tB = (Object.values(beforeVotes) as number[]).reduce<number>((a, b) => a + b, 0); const tA = (Object.values(afterVotes) as number[]).reduce<number>((a, b) => a + b, 0); const pB = tB > 0 ? (beforeVotes[opt.id] / tB) * 100 : 0; const pA = tA > 0 ? (afterVotes[opt.id] / tA) * 100 : 0; return (<div key={opt.id} className="space-y-2"><div className="flex justify-between items-end px-2"><span className="text-xl">{opt.icon} <span className="text-sm font-black uppercase text-slate-700">{opt.label}</span></span><span className="text-[10px] font-black text-indigo-500 uppercase">Före: {Math.round(pB)}% → Efter: {Math.round(pA)}%</span></div><div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner flex"><div className={`h-full ${opt.color} opacity-30`} style={{ width: `${pB}%` }} /><div className={`h-full ${opt.color} border-l-2 border-white`} style={{ width: `${pA}%` }} /></div></div>);})}</div></div>
          ) : (
            <div className="flex-1 flex flex-col justify-center py-6"><h3 className="text-3xl md:text-5xl font-black text-slate-800 text-center mb-12 tracking-tight leading-tight px-4">{question}</h3><div className={`grid ${options.length <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'} gap-4 max-w-5xl mx-auto w-full`}>{options.map(opt => (<button key={opt.id} onClick={() => manualVote(opt.id)} className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-[3rem] hover:border-indigo-400 hover:shadow-2xl transition-all group relative"><span className="text-6xl mb-4 group-hover:scale-110 transition-transform">{opt.icon}</span><span className="text-lg font-black text-slate-800">{opt.label}</span><div className={`mt-6 px-4 py-1 rounded-full text-[10px] font-black text-white ${opt.color}`}>{pollType === 'mindset' ? (phase === 'before' ? beforeVotes[opt.id] : afterVotes[opt.id]) : opt.votes} RÖSTER</div></button>))}</div><div className="mt-12 max-w-2xl mx-auto w-full bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100"><div className="flex items-center justify-between mb-4 px-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{totalVotes} svar insamlade</span><button onClick={() => setShowResults(!showResults)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">{showResults ? 'Dölj' : 'Visa'} resultat</button></div>{showResults && (<div className="space-y-4 animate-in slide-in-from-bottom-2">{options.map(opt => { const currentV = pollType === 'mindset' ? (phase === 'after' ? afterVotes[opt.id] : beforeVotes[opt.id]) : opt.votes; const p = totalVotes > 0 ? (currentV / totalVotes) * 100 : 0; return (<div key={opt.id} className="space-y-1"><div className="flex justify-between text-[9px] font-black uppercase px-2 text-slate-500"><span>{opt.icon} {opt.label}</span><span>{Math.round(p)}%</span></div><div className="h-3 bg-white rounded-full overflow-hidden p-0.5 border border-slate-100"><div className={`h-full ${opt.color} rounded-full transition-all duration-1000`} style={{ width: `${p}%` }} /></div></div>);})}</div>)}</div></div>
          )}
        </div>
      )}
    </div>
  );
};

export default PollingTool;
