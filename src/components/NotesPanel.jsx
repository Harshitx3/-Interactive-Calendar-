import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Save, CheckCircle2, Trash2, CalendarRange, ListTodo, Plus, ChevronRight, Edit2 } from 'lucide-react';
import { format, parse } from 'date-fns';

const NotesPanel = ({ darkMode, startDate, endDate, onSelectRange }) => {
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [savedNotesList, setSavedNotesList] = useState([]);

  // Generate unique key based on selected range
  const storageKey = useMemo(() => {
    if (!startDate) return 'calendar-notes-global';
    const startStr = format(startDate, 'yyyy-MM-dd');
    if (!endDate) return `calendar-notes-${startStr}`;
    const endStr = format(endDate, 'yyyy-MM-dd');
    return `calendar-notes-${startStr}-to-${endStr}`;
  }, [startDate, endDate]);

  const rangeTitle = useMemo(() => {
    if (!startDate) return 'General Month Memo';
    const startStr = format(startDate, 'MMM d');
    if (!endDate) return `Note for ${startStr}`;
    const endStr = format(endDate, 'MMM d');
    return `Note: ${startStr} → ${endStr}`;
  }, [startDate, endDate]);

  // Scan localStorage for all calendar notes
  const refreshSavedList = useCallback(() => {
    const allNotes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('calendar-notes-')) {
        const content = localStorage.getItem(key);
        if (content) {
          // Extract title from key
          let title = 'General Memo';
          if (key !== 'calendar-notes-global') {
            const parts = key.replace('calendar-notes-', '').split('-to-');
            if (parts.length === 2) {
              const s = parse(parts[0], 'yyyy-MM-dd', new Date());
              const e = parse(parts[1], 'yyyy-MM-dd', new Date());
              title = `${format(s, 'MMM d')} - ${format(e, 'MMM d')}`;
            } else {
              const s = parse(parts[0], 'yyyy-MM-dd', new Date());
              title = `Date: ${format(s, 'MMM d')}`;
            }
          }
          allNotes.push({ key, content, title });
        }
      }
    }
    setSavedNotesList(allNotes);
  }, []);

  // Load saved notes when key changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setNotes(saved || '');
    setIsSaved(false);
    refreshSavedList();
  }, [storageKey, refreshSavedList]);

  const handleSave = () => {
    if (notes.trim() === '') {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, notes);
    }
    setIsSaved(true);
    refreshSavedList();
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDelete = (keyToDelete = storageKey) => {
    if (window.confirm('Delete this note?')) {
      localStorage.removeItem(keyToDelete);
      if (keyToDelete === storageKey) setNotes('');
      refreshSavedList();
    }
  };

  const handleEditFromList = (item) => {
    if (item.key === 'calendar-notes-global') {
      onSelectRange(null, null);
    } else {
      const parts = item.key.replace('calendar-notes-', '').split('-to-');
      if (parts.length === 2) {
        onSelectRange(parse(parts[0], 'yyyy-MM-dd', new Date()), parse(parts[1], 'yyyy-MM-dd', new Date()));
      } else {
        onSelectRange(parse(parts[0], 'yyyy-MM-dd', new Date()), null);
      }
    }
  };

  return (
    <div className={`rounded-[2rem] shadow-2xl p-6 md:p-8 flex flex-col h-full transition-all duration-700 overflow-hidden glass-effect min-w-0 w-full ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      
      {/* Active Note Section */}
      <div className="flex flex-col gap-6 mb-10 flex-shrink-0 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black tracking-tight whitespace-nowrap">
              {startDate ? 'Note' : 'Memo'}
            </h3>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap"
          >
            <Save size={16} />
            Save
          </button>
        </div>
        
        <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border transition-all truncate max-w-full ${darkMode ? 'bg-slate-900/50 border-slate-700/50 text-blue-400' : 'bg-blue-50 border-blue-100/50 text-blue-600'}`}>
          {rangeTitle}
        </div>

        <div className="relative group">
          <textarea
            className={`w-full p-5 border rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-none font-medium h-40 transition-all text-sm leading-relaxed block ${darkMode ? 'bg-slate-950/50 border-slate-800 text-slate-300 placeholder-slate-700' : 'bg-white/50 border-slate-100 text-slate-700 placeholder-slate-400'}`}
            placeholder="Capture your thoughts..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className={`absolute bottom-4 right-4 transition-all duration-500 transform ${isSaved ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl ${darkMode ? 'text-emerald-400 bg-slate-900 border-emerald-500/30' : 'text-emerald-600 bg-white border-emerald-100'}`}>
              <CheckCircle2 size={14} className="animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest">Captured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Notes History List */}
      <div className="flex flex-col gap-6 overflow-hidden flex-1">
        <div className="flex items-center justify-between border-t border-slate-200/20 pt-8 mb-2">
          <div className="flex items-center gap-2">
            <ListTodo size={18} className="text-blue-500" />
            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Collection
            </h4>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
            {savedNotesList.length}
          </span>
        </div>

        <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {savedNotesList.length === 0 ? (
            <div className={`text-center py-10 space-y-3 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`}>
              <div className="flex justify-center">
                <CalendarRange size={32} strokeWidth={1} />
              </div>
              <p className="text-xs font-medium italic tracking-wide">
                Empty collection
              </p>
            </div>
          ) : (
            savedNotesList.map((item) => (
              <div 
                key={item.key}
                onClick={() => handleEditFromList(item)}
                className={`group relative flex flex-col p-5 rounded-[1.5rem] border transition-all duration-300 cursor-pointer ${
                  item.key === storageKey 
                  ? (darkMode ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-blue-50 border-blue-200 shadow-sm')
                  : (darkMode ? 'bg-slate-900/20 border-slate-800 hover:border-slate-700' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 shadow-sm')
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.key === storageKey ? 'text-blue-500' : (darkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEditFromList(item); }}
                      className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-slate-500 hover:bg-blue-500/20 hover:text-blue-400' : 'text-slate-400 hover:bg-blue-100 hover:text-blue-600'}`}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.key); }}
                      className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-slate-500 hover:bg-red-500/20 hover:text-red-400' : 'text-slate-400 hover:bg-red-100 hover:text-red-600'}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <p className={`text-xs font-medium leading-relaxed truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.content}
                </p>
                {item.key === storageKey && (
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
