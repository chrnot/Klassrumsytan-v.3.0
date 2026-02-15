
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ToolType, Student, PlacementStudent, WidgetInstance, PageData } from './types';
import Sidebar from './components/Sidebar';
import Timer from './components/Timer';
import Randomizer from './components/Randomizer';
import TrafficLight from './components/TrafficLight';
import GroupingTool from './components/GroupingTool';
import SmartChecklist from './components/SmartChecklist';
import Whiteboard from './components/Whiteboard';
import QRCodeWidget from './components/QRCodeWidget';
import PollingTool from './components/PollingTool';
import WidgetFrame from './components/WidgetFrame';
import Dashboard from './components/Dashboard';
import BackgroundSelector from './components/BackgroundSelector';
import ImageAnnotator from './components/ImageAnnotator';
import StudentPollView from './components/StudentPollView';
import GeminiAssistant from './components/GeminiAssistant';
import VideoPlayer from './components/VideoPlayer';
import QuickLinks from './components/QuickLinks';
import LinkWidget from './components/LinkWidget';
import ClassroomPlacement from './components/ClassroomPlacement';
import LessonNavigator from './components/LessonNavigator';
import TieredTaskCard from './components/TieredTaskCard';
import ConversationBubbles from './components/ConversationBubbles';
import TwoStarsAndAWish from './components/TwoStarsAndAWish';
import SourceCriticismFilter from './components/SourceCriticismFilter';
import VennDiagram from './components/VennDiagram';
import SAMRElevator from './components/SAMRElevator';
import ConceptDiamond from './components/ConceptDiamond';

const App: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const pollIdFromUrl = queryParams.get('join');
  const isStudent = !!pollIdFromUrl;

  const [pages, setPages] = useState<PageData[]>(() => {
    const saved = localStorage.getItem('kp_pages_v2');
    if (saved) return JSON.parse(saved);
    return [{
      id: Math.random().toString(36).substr(2, 9),
      name: 'Sida 1',
      background: 'bg-slate-100',
      widgets: []
    }];
  });
  
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [editingPageIndex, setEditingPageIndex] = useState<number | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isStudent && window.innerWidth > 1024);
  const [isBackgroundSettingsOpen, setIsBackgroundSettingsOpen] = useState(false);
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);
  
  const [students, setStudents] = useState<PlacementStudent[]>(() => {
    const saved = localStorage.getItem('kp_students_v3');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [maxZIndex, setMaxZIndex] = useState(200);

  const currentPage = pages[activePageIndex] || pages[0];
  const activeWidgets = currentPage.widgets.filter(w => w.isOpen);
  const openWidgetTypes = [...new Set(activeWidgets.map(w => w.type))];

  useEffect(() => {
    if (!isStudent) {
      localStorage.setItem('kp_pages_v2', JSON.stringify(pages));
      localStorage.setItem('kp_students_v3', JSON.stringify(students));
    }
  }, [pages, students, isStudent]);

  const updateCurrentPage = useCallback((updates: Partial<PageData>) => {
    setPages(prev => prev.map((p, i) => i === activePageIndex ? { ...p, ...updates } : p));
  }, [activePageIndex]);

  const addPage = () => {
    if (pages.length >= 6) {
      alert("Max 6 sidor tillåtna.");
      return;
    }
    const newPage: PageData = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Sida ${pages.length + 1}`,
      background: 'bg-slate-100',
      widgets: []
    };
    setPages([...pages, newPage]);
    setActivePageIndex(pages.length);
  };

  const removePage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pages.length <= 1) return;
    if (window.confirm(`Vill du ta bort "${pages[index].name}"? Alla verktyg på sidan försvinner.`)) {
      const newPages = pages.filter((_, i) => i !== index);
      setPages(newPages);
      setActivePageIndex(Math.max(0, activePageIndex - 1));
    }
  };

  const startEditing = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPageIndex(index);
    setEditNameValue(pages[index].name);
  };

  const savePageName = () => {
    if (editingPageIndex !== null && editNameValue.trim()) {
      setPages(prev => prev.map((p, i) => i === editingPageIndex ? { ...p, name: editNameValue.trim() } : p));
    }
    setEditingPageIndex(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') savePageName();
    if (e.key === 'Escape') setEditingPageIndex(null);
  };

  const getInitialDimensions = (type: ToolType) => {
    switch (type) {
      case ToolType.TIMER: return { width: 450, height: 680 };
      case ToolType.RANDOMIZER: return { width: 600, height: 600 };
      case ToolType.POLLING: return { width: 850, height: 750 };
      case ToolType.ASSISTANT: return { width: 500, height: 750 };
      case ToolType.TRAFFIC_LIGHT: return { width: 500, height: 700 };
      case ToolType.CHECKLIST: return { width: 550, height: 750 };
      case ToolType.GROUPING: return { width: 750, height: 750 };
      case ToolType.VIDEO_PLAYER: return { width: 800, height: 600 };
      case ToolType.QUICK_LINKS: return { width: 400, height: 650 };
      case ToolType.PLACEMENT: return { width: 1100, height: 850 };
      case ToolType.LINK: return { width: 220, height: 220 };
      case ToolType.LESSON_NAVIGATOR: return { width: 750, height: 750 };
      case ToolType.TIERED_TASK: return { width: 900, height: 800 };
      case ToolType.MINDSET_CHECK: return { width: 850, height: 850 };
      case ToolType.CONVERSATION_BUBBLES: return { width: 850, height: 800 };
      case ToolType.STARS_WISH: return { width: 700, height: 750 };
      case ToolType.SOURCE_CRITICISM: return { width: 380, height: 750 };
      case ToolType.VENN_DIAGRAM: return { width: 980, height: 820 };
      case ToolType.SAMR_HISSEN: return { width: 480, height: 850 };
      case ToolType.CONCEPT_DIAMOND: return { width: 950, height: 800 };
      default: return { width: 700, height: 750 };
    }
  };

  const toggleWidget = useCallback((type: ToolType) => {
    if (type === ToolType.LINK) return;
    const existing = currentPage.widgets.find(w => w.type === type);
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    if (existing) {
      updateCurrentPage({ widgets: currentPage.widgets.map(w => w.type === type ? { ...w, isOpen: !w.isOpen, zIndex: newZ } : w) });
    } else {
      const { width, height } = getInitialDimensions(type);
      const pos = { x: Math.max(20, (window.innerWidth - width) / 2), y: Math.max(20, (window.innerHeight - height) / 2) };
      updateCurrentPage({ widgets: [...currentPage.widgets, { id: Math.random().toString(36).substr(2, 9), type, x: pos.x, y: pos.y, zIndex: newZ, isOpen: true, width, height }] });
    }
  }, [currentPage, maxZIndex, updateCurrentPage]);

  const addLinkWidget = useCallback((url: string, title: string) => {
    const currentLinks = currentPage.widgets.filter(w => w.type === ToolType.LINK && w.isOpen);
    if (currentLinks.length >= 5) { alert("Max 5 fristående länkar per sida."); return; }
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    const { width, height } = getInitialDimensions(ToolType.LINK);
    const pos = { x: 100 + currentLinks.length * 30, y: 100 + currentLinks.length * 30 };
    updateCurrentPage({ widgets: [...currentPage.widgets, { id: Math.random().toString(36).substr(2, 9), type: ToolType.LINK, x: pos.x, y: pos.y, zIndex: newZ, isOpen: true, width, height, data: { url, title } }] });
  }, [currentPage, maxZIndex, updateCurrentPage]);

  const arrangeWidgets = useCallback(() => {
    const active = currentPage.widgets.filter(w => w.isOpen);
    if (active.length === 0) return;
    const sidebarWidth = isSidebarOpen ? 288 : 0;
    const padding = 40;
    const availW = window.innerWidth - sidebarWidth - (padding * 2);
    const availH = window.innerHeight - (padding * 2);
    const cols = active.length > 4 ? 3 : active.length > 1 ? 2 : 1;
    const rows = Math.ceil(active.length / cols);
    const cellW = availW / cols;
    const cellH = availH / rows;
    updateCurrentPage({
      widgets: currentPage.widgets.map(w => {
        if (!w.isOpen) return w;
        const idx = active.findIndex(aw => aw.id === w.id);
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const dims = getInitialDimensions(w.type);
        const targetW = Math.min(w.width || dims.width, cellW - 30);
        const targetH = Math.min(w.height || dims.height, cellH - 30);
        return { ...w, x: Math.max(0, sidebarWidth + padding + (col * cellW) + (cellW - targetW) / 2), y: Math.max(0, padding + (row * cellH) + (cellH - targetH) / 2), width: targetW, height: targetH };
      })
    });
  }, [currentPage, isSidebarOpen, updateCurrentPage]);

  const clearWorkspace = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (window.confirm("Vill du stänga alla verktyg på denna sida?")) {
      updateCurrentPage({ widgets: [] });
      setIsSystemMenuOpen(false);
      setMaxZIndex(200);
    }
  };

  const focusWidget = (id: string) => {
    const target = currentPage.widgets.find(w => w.id === id);
    if (!target || target.zIndex === maxZIndex) return;
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    updateCurrentPage({ widgets: currentPage.widgets.map(w => w.id === id ? { ...w, zIndex: newZ } : w) });
  };

  // Fixed missing toolDescriptions mapping ToolType to user-friendly descriptions
  const toolDescriptions: Record<string, string> = {
    [ToolType.TIMER]: 'Sätt fokus med en visuell nedräkning eller använd stoppuret för tidtagning.',
    [ToolType.RANDOMIZER]: 'Dra en slumpmässig elev med hjälp av de klassiska glasspinnarna.',
    [ToolType.POLLING]: 'Stäm av läget i klassrummet med snabba digitala frågor.',
    [ToolType.ASSISTANT]: 'Få hjälp av AI att planera snabba och kreativa pedagogiska aktiviteter.',
    [ToolType.TRAFFIC_LIGHT]: 'Kommunicera tydligt till eleverna vad som förväntas just nu.',
    [ToolType.GROUPING]: 'Skapa slumpmässiga och rättvisa grupper för samarbete.',
    [ToolType.CHECKLIST]: 'Håll ordning på lektionens moment med en interaktiv checklista.',
    [ToolType.WHITEBOARD]: 'En rityta för att förklara begrepp och visualisera idéer.',
    [ToolType.IMAGE_ANNOTATOR]: 'Ladda upp en bild och rita direkt ovanpå för att förtydliga.',
    [ToolType.QR_CODE]: 'Skapa en QR-kod så att eleverna snabbt hittar till rätt webbsida.',
    [ToolType.VIDEO_PLAYER]: 'Visa videoklipp utan reklam och distraktioner runt omkring.',
    [ToolType.QUICK_LINKS]: 'Skapa genvägar till webbsidor som eleverna ofta använder.',
    [ToolType.PLACEMENT]: 'Planera och optimera klassens placeringar på ett smart sätt.',
    [ToolType.LESSON_NAVIGATOR]: 'Ge eleverna en tydlig överblick över lektionens mål och tidsplan.',
    [ToolType.TIERED_TASK]: 'Erbjud differentiering med progressiva ledtrådar och utmaningar.',
    [ToolType.MINDSET_CHECK]: 'Följ upp elevernas självförtroende och mindset under lektionen.',
    [ToolType.CONVERSATION_BUBBLES]: 'Ge eleverna språkligt stöd i deras diskussioner och samtal.',
    [ToolType.STARS_WISH]: 'Ett enkelt verktyg för att ge och visualisera formativ feedback.',
    [ToolType.SOURCE_CRITICISM]: 'Hjälp eleverna att granska källor med ett interaktivt filter.',
    [ToolType.VENN_DIAGRAM]: 'Jämför begrepp och hitta likheter och skillnader i en klassisk modell.',
    [ToolType.SAMR_HISSEN]: 'Analysera och utveckla din digitala undervisning med SAMR-modellen.',
    [ToolType.CONCEPT_DIAMOND]: 'Gå på djupet med viktiga begrepp med hjälp av Frayer-modellen.',
    [ToolType.LINK]: 'En genväg till en specifik webbplats.'
  };

  const metaData: Record<string, { title: string, subtitle?: string, icon: string }> = {
    [ToolType.TIMER]: { title: 'Timer', subtitle: 'Stoppur & Nedräkning', icon: '⏱️' },
    [ToolType.RANDOMIZER]: { title: 'Slumpa', subtitle: 'Rättvis fördelning', icon: '🎲' },
    [ToolType.POLLING]: { title: 'Omröstning', subtitle: 'Live digital avstämning', icon: '📊' },
    [ToolType.ASSISTANT]: { title: 'AI-Aktivitet', subtitle: 'Röststyrd hjälp', icon: '✨' },
    [ToolType.TRAFFIC_LIGHT]: { title: 'Trafikljus', subtitle: 'Kommunikationsstatus', icon: '🚦' },
    [ToolType.GROUPING]: { title: 'Gruppering', subtitle: 'Dela in klassen', icon: '👥' },
    [ToolType.CHECKLIST]: { title: 'Arbetsgång', subtitle: 'Planera moment', icon: '✅' },
    [ToolType.WHITEBOARD]: { title: 'Whiteboard', subtitle: 'Rityta för förklaringar', icon: '🎨' },
    [ToolType.IMAGE_ANNOTATOR]: { title: 'Bild-rita', subtitle: 'Annotera filer', icon: '📸' },
    [ToolType.QR_CODE]: { title: 'QR-Kod', subtitle: 'Dela länkar snabbt', icon: '📱' },
    [ToolType.VIDEO_PLAYER]: { title: 'Video', subtitle: 'Distraktionsfri visning', icon: '🎬' },
    [ToolType.QUICK_LINKS]: { title: 'Genvägar', subtitle: 'Hantera länkwidgets', icon: '🔗' },
    [ToolType.PLACEMENT]: { title: 'Klassplacering', subtitle: 'Möbleringsverktyg', icon: '🪑' },
    [ToolType.LESSON_NAVIGATOR]: { title: 'Lektions-Navigatör', subtitle: 'Struktur & Mål', icon: '🧭' },
    [ToolType.TIERED_TASK]: { title: 'Nivå-Kortet', subtitle: 'Differentierat stöd', icon: '🎴' },
    [ToolType.MINDSET_CHECK]: { title: 'Känslo-Kollen', subtitle: 'Growth Mindset', icon: '📊' },
    [ToolType.CONVERSATION_BUBBLES]: { title: 'Snack-Bubblan', subtitle: 'Språkligt stöd', icon: '💬' },
    [ToolType.STARS_WISH]: { title: 'Stjärnor & Önskan', subtitle: 'Formativ feedback', icon: '⭐' },
    [ToolType.SOURCE_CRITICISM]: { title: 'Källkritik', subtitle: 'Utvärdera källans pålitlighet', icon: '🔍' },
    [ToolType.VENN_DIAGRAM]: { title: 'Venn-Analys', subtitle: 'Jämför begrepp', icon: '⭕⭕' },
    [ToolType.SAMR_HISSEN]: { title: 'SAMR-Hissen', subtitle: 'Lyft undervisningen', icon: '🛗' },
    [ToolType.CONCEPT_DIAMOND]: { title: 'Begrepps-Diamant', subtitle: 'Frayer-modellen', icon: '💠' },
    [ToolType.LINK]: { title: 'Länk', icon: '🔗' }
  };

  const getWidgetComponent = (widget: WidgetInstance) => {
    switch (widget.type) {
      case ToolType.TIMER: return <Timer />;
      case ToolType.RANDOMIZER: return <Randomizer students={students} setStudents={setStudents} />;
      case ToolType.POLLING: return <PollingTool initialType="standard" />;
      case ToolType.ASSISTANT: return <GeminiAssistant />;
      case ToolType.TRAFFIC_LIGHT: return <TrafficLight />;
      case ToolType.GROUPING: return <GroupingTool students={students} onResize={(w, h) => updateCurrentPage({ widgets: currentPage.widgets.map(wi => wi.id === widget.id ? { ...wi, width: w, height: h } : wi) })} />;
      case ToolType.CHECKLIST: return <SmartChecklist />;
      case ToolType.WHITEBOARD: return <Whiteboard />;
      case ToolType.IMAGE_ANNOTATOR: return <ImageAnnotator />;
      case ToolType.QR_CODE: return <QRCodeWidget />;
      case ToolType.VIDEO_PLAYER: return <VideoPlayer />;
      case ToolType.QUICK_LINKS: return <QuickLinks onAddLink={addLinkWidget} existingLinksCount={currentPage.widgets.filter(w => w.type === ToolType.LINK && w.isOpen).length} />;
      case ToolType.PLACEMENT: return <ClassroomPlacement students={students} setStudents={setStudents} />;
      case ToolType.LINK: return <LinkWidget url={widget.data?.url} title={widget.data?.title} />;
      case ToolType.LESSON_NAVIGATOR: return <LessonNavigator />;
      case ToolType.TIERED_TASK: return <TieredTaskCard />;
      case ToolType.MINDSET_CHECK: return <PollingTool initialType="mindset" />;
      case ToolType.CONVERSATION_BUBBLES: return <ConversationBubbles />;
      case ToolType.STARS_WISH: return <TwoStarsAndAWish />;
      case ToolType.SOURCE_CRITICISM: return <SourceCriticismFilter />;
      case ToolType.VENN_DIAGRAM: return <VennDiagram />;
      case ToolType.SAMR_HISSEN: return <SAMRElevator />;
      case ToolType.CONCEPT_DIAMOND: return <ConceptDiamond />;
      default: return null;
    }
  };

  if (isStudent && pollIdFromUrl) return <StudentPollView pollId={pollIdFromUrl} />;

  const isImageUrl = currentPage.background.startsWith('http') || currentPage.background.startsWith('data:image');
  const isColorHex = currentPage.background.startsWith('#');

  return (
    <div className={`flex h-screen w-screen overflow-hidden transition-all duration-700 ${currentPage.background.includes('bg-') ? currentPage.background : ''}`} style={{ backgroundColor: isColorHex ? currentPage.background : undefined, backgroundImage: isImageUrl ? `url("${currentPage.background}")` : undefined, backgroundSize: isImageUrl ? 'cover' : undefined, backgroundPosition: isImageUrl ? 'center' : undefined }}>
      {isSidebarOpen && (
        <div className="fixed inset-0 lg:relative lg:inset-auto w-full md:w-72 z-[100000] animate-in slide-in-from-left duration-300">
          <Sidebar activeTool={null} onSelectTool={(t) => { t === ToolType.MATTEYTAN ? window.open('https://matteytan.se/', '_blank') : toggleWidget(t); setIsSidebarOpen(false); }} onClose={() => setIsSidebarOpen(false)} openWidgets={openWidgetTypes} />
        </div>
      )}

      <main className="flex-1 relative overflow-hidden">
        {!isStudent && (
          <div className="absolute top-6 left-6 w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center text-2xl z-[99999] hover:scale-110 transition-transform cursor-pointer" onClick={() => setIsSidebarOpen(true)}>🏫</div>
        )}

        <div className="absolute inset-0 z-10 pointer-events-none">
          {activeWidgets.map((w) => (
            <WidgetFrame key={w.id} title={w.type === ToolType.LINK ? (w.data?.title || 'Länk') : (metaData[w.type]?.title || 'Verktyg')} subtitle={metaData[w.type]?.subtitle} icon={w.type === ToolType.LINK ? '🔗' : (metaData[w.type]?.icon || '⚙️')} description={toolDescriptions[w.type]} x={w.x} y={w.y} zIndex={w.zIndex} initialWidth={w.width} initialHeight={w.height} onMove={(nx, ny) => updateCurrentPage({ widgets: currentPage.widgets.map(wi => wi.id === w.id ? { ...wi, x: nx, y: ny } : wi) })} onResize={(nw, nh) => updateCurrentPage({ widgets: currentPage.widgets.map(wi => wi.id === w.id ? { ...wi, width: nw, height: nh } : wi) })} onFocus={() => focusWidget(w.id)} onClose={() => updateCurrentPage({ widgets: currentPage.widgets.map(wi => wi.id === w.id ? { ...wi, isOpen: false } : wi) })}>
              {getWidgetComponent(w)}
            </WidgetFrame>
          ))}
        </div>

        {!isStudent && (
          <div className="absolute top-6 right-6 z-[99999] flex items-start gap-3">
            <button onClick={arrangeWidgets} className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all border border-white">🧩</button>
            <div className="flex flex-col gap-2">
              <button onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)} className={`w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all border border-white ${isSystemMenuOpen ? 'ring-2 ring-indigo-500' : ''}`}>⚙️</button>
              {isSystemMenuOpen && (
                <div className="flex flex-col gap-2 animate-in slide-in-from-top-4">
                  <button onClick={clearWorkspace} className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center justify-center hover:scale-110 active:scale-95 border border-white group">
                    <span className="text-xl">🧹</span>
                    <span className="text-[7px] font-black uppercase text-slate-400 group-hover:text-red-500">Rensa</span>
                  </button>
                  <button onClick={() => { setIsBackgroundSettingsOpen(true); setIsSystemMenuOpen(false); }} className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center justify-center hover:scale-110 active:scale-95 border border-white group">
                    <span className="text-xl">🖼️</span>
                    <span className="text-[7px] font-black uppercase text-slate-400 group-hover:text-indigo-500">Miljö</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SIDNAVIGERING LÄNGST NER - Nu med Inline Edit */}
        {!isStudent && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-2 p-2 bg-white/95 backdrop-blur-md rounded-[2.2rem] shadow-2xl border border-white/50 animate-in slide-in-from-bottom-4">
            {pages.map((page, idx) => (
              <div key={page.id} className="relative group/tab flex items-center">
                {editingPageIndex === idx ? (
                  <input
                    autoFocus
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                    onBlur={savePageName}
                    onKeyDown={handleEditKeyDown}
                    className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 outline-none border-2 border-indigo-200 w-[140px]"
                  />
                ) : (
                  <button
                    onClick={() => setActivePageIndex(idx)}
                    onDoubleClick={(e) => startEditing(idx, e)}
                    className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                      activePageIndex === idx 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                  >
                    <span className="truncate max-w-[100px]">{page.name}</span>
                    {activePageIndex === idx && (
                      <span 
                        onClick={(e) => startEditing(idx, e)}
                        className="text-[10px] hover:scale-125 transition-transform cursor-pointer bg-white/20 p-1 rounded-md"
                        title="Byt namn"
                      >
                        ✎
                      </span>
                    )}
                  </button>
                )}
                {pages.length > 1 && editingPageIndex !== idx && (
                  <button 
                    onClick={(e) => removePage(idx, e)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-white text-slate-400 rounded-full text-[8px] border border-slate-100 opacity-0 group-hover/tab:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center shadow-sm z-10"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {pages.length < 6 && (
              <button 
                onClick={addPage}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-black text-xl border border-transparent hover:border-indigo-100"
                title="Lägg till ny sida"
              >
                +
              </button>
            )}
          </div>
        )}

        {activeWidgets.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto h-full scroll-smooth custom-scrollbar">
            <Dashboard onSelectTool={toggleWidget} studentsCount={students.length} currentBackground={currentPage.background} onBackgroundSelect={(bg) => updateCurrentPage({ background: bg })} />
          </div>
        )}
      </main>
      
      {isBackgroundSettingsOpen && (
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsBackgroundSettingsOpen(false)} />
          <div className="relative bg-white/95 backdrop-blur-xl border border-white p-8 rounded-[3.5rem] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">🖼️ Välj stämning</h3>
              <button onClick={() => setIsBackgroundSettingsOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-400">✕</button>
            </div>
            <BackgroundSelector current={currentPage.background} onSelect={(bg) => updateCurrentPage({ background: bg })} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
