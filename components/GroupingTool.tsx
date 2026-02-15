
import React, { useState, useEffect } from 'react';
import { Student, Group } from '../types';

interface GroupingToolProps {
  students: Student[];
  onResize?: (width: number, height: number) => void;
}

const GroupingTool: React.FC<GroupingToolProps> = ({ students, onResize }) => {
  const [groupCount, setGroupCount] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [editingStudent, setEditingStudent] = useState<{ groupId: number, studentId: string } | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const generateGroups = () => {
    if (students.length === 0) return;
    
    const shuffled = [...students].sort(() => 0.5 - Math.random());
    const newGroups: Group[] = Array.from({ length: groupCount }, (_, i) => ({
      id: i + 1,
      members: []
    }));

    shuffled.forEach((student, index) => {
      newGroups[index % groupCount].members.push({ ...student });
    });

    setGroups(newGroups);
    setEditingStudent(null);
  };

  const toggleViewMode = () => {
    const nextMode = !isViewMode;
    setIsViewMode(nextMode);

    if (onResize && groups.length > 0) {
      if (nextMode) {
        const cols = groups.length <= 2 ? groups.length : groups.length <= 4 ? 2 : 3;
        const rows = Math.ceil(groups.length / cols);
        const maxMembers = Math.max(...groups.map(g => g.members.length));
        const nameRowHeight = 54;
        const headerAndPaddingHeight = 100; 
        
        const calculatedWidth = (cols * 320) + 60;
        const calculatedHeight = (rows * (maxMembers * nameRowHeight + 80)) + headerAndPaddingHeight;

        onResize(Math.min(window.innerWidth - 60, calculatedWidth), Math.min(window.innerHeight - 80, calculatedHeight));
      } else {
        onResize(750, 750);
      }
    }
  };

  const updateStudentName = (groupId: number, studentId: string, newName: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.members.map(member => 
            member.id === studentId ? { ...member, name: newName } : member
          )
        };
      }
      return group;
    }));
  };

  const removeStudentFromGroup = (groupId: number, studentId: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.members.filter(m => m.id !== studentId)
        };
      }
      return group;
    }));
  };

  return (
    <div className={`flex flex-col h-full bg-white animate-in fade-in duration-500 pt-6 ${isViewMode ? 'p-0 overflow-hidden' : ''}`}>
      <div className="flex items-center justify-end gap-2 px-6 mb-6 shrink-0 no-drag">
        {!isViewMode && (
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <div className="flex flex-col px-3">
              <span className="text-[7px] uppercase tracking-wider font-black text-slate-400">Grupper</span>
              <input 
                type="number" min="2" max="20"
                value={groupCount}
                onChange={(e) => setGroupCount(parseInt(e.target.value) || 2)}
                className="text-sm font-black text-indigo-600 w-8 bg-transparent outline-none"
              />
            </div>
            <button onClick={generateGroups} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-black hover:bg-indigo-700 transition-all text-[10px] uppercase tracking-widest">Slumpa</button>
          </div>
        )}

        {groups.length > 0 && (
          <button
            onClick={toggleViewMode}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 ${
              isViewMode ? 'bg-white border border-slate-200 text-slate-500' : 'bg-amber-500 text-white'
            }`}
          >
            {isViewMode ? '⚙️ Redigera' : '📺 Storskärm'}
          </button>
        )}
      </div>

      <div className={`flex-1 ${isViewMode ? 'p-6 bg-slate-50/30' : 'overflow-y-auto custom-scrollbar px-6'}`}>
        {groups.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center h-full flex flex-col items-center justify-center opacity-40">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Slumpa grupper för att börja</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${isViewMode ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
            {groups.map((group) => (
              <div key={group.id} className={`flex flex-col transition-all duration-300 ${isViewMode ? 'bg-white border-2 border-indigo-50 rounded-[2.5rem] p-6 shadow-sm' : 'bg-white border border-slate-100 rounded-[2rem] p-4'}`}>
                <h3 className={`font-black flex justify-between items-center ${isViewMode ? 'text-indigo-500 text-sm mb-4 border-b-2 border-indigo-50 pb-2' : 'text-slate-800 text-[10px] uppercase tracking-widest mb-3 border-b border-slate-50 pb-2'}`}>
                  GRUPP {group.id}
                  <span className={`font-bold text-[9px] px-2 py-0.5 rounded-full ${isViewMode ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>{group.members.length} elever</span>
                </h3>
                <ul className={`${isViewMode ? 'space-y-3' : 'space-y-1.5'}`}>
                  {group.members.map((m) => (
                    <li key={m.id} className="group relative">
                      {editingStudent?.studentId === m.id && editingStudent.groupId === group.id ? (
                        <input autoFocus type="text" value={m.name} onBlur={() => setEditingStudent(null)} onKeyDown={(e) => e.key === 'Enter' && setEditingStudent(null)} onChange={(e) => updateStudentName(group.id, m.id, e.target.value)} className="w-full text-base font-bold text-indigo-900 bg-white border-2 border-indigo-200 py-1.5 px-3 rounded-xl outline-none" />
                      ) : (
                        <div className={`flex items-center justify-between gap-2 transition-colors rounded-xl ${isViewMode ? '' : 'py-1 px-2 hover:bg-slate-50 cursor-pointer'}`} onClick={() => !isViewMode && setEditingStudent({ groupId: group.id, studentId: m.id })}>
                          <span className={`font-black truncate tracking-tight ${isViewMode ? 'text-3xl text-slate-800' : 'text-slate-600 text-sm'}`}>{m.name}</span>
                          {!isViewMode && <button onClick={(e) => { e.stopPropagation(); removeStudentFromGroup(group.id, m.id); }} className="text-slate-200 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100">✕</button>}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupingTool;
