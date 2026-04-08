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
    <div className={`rounded-2xl shadow-xl border p-6 flex flex-col h-full transition-all duration-500 overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      
      {/* Active Note Section */}
      <div className="flex flex-col gap-4 mb-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
            <Plus size={24} className="text-blue-500" />
            {startDate ? 'Active Note' : 'Monthly Memo'}
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md active:scale-95"
            >
              <Save size={18} />
              Save
            </button>
          </div>
        </div>
        
        <div className={`text-sm font-semibold px-3 py-1.5 rounded-lg border w-fit ${darkMode ? 'bg-slate-900/50 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
          {rangeTitle}
        </div>

        <textarea
          className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-medium h-32 transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-300 placeholder-slate-600' : 'bg-slate-50/50 border-slate-200 text-slate-700 placeholder-slate-400'}`}
          placeholder="Write your notes here... They'll be linked to your calendar selection."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        
        <div className={`transition-all duration-300 transform ${isSaved ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border w-fit ${darkMode ? 'text-emerald-400 bg-emerald-900/20 border-emerald-900/50' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Saved</span>
          </div>
        </div>
      </div>

      {/* Saved Notes History List */}
      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center gap-2 border-t pt-6 mb-2 border-slate-100 dark:border-slate-700">
          <ListTodo size={20} className="text-blue-500" />
          <h4 className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            All Saved Notes
          </h4>
        </div>

        <div className="overflow-y-auto pr-2 space-y-3 max-h-64 custom-scrollbar">
          {savedNotesList.length === 0 ? (
            <p className={`text-xs italic text-center py-4 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
              No saved notes yet. Start typing above!
            </p>
          ) : (
            savedNotesList.map((item) => (
              <div 
                key={item.key}
                onClick={() => handleEditFromList(item)}
                className={`group relative flex flex-col p-3 rounded-xl border transition-all cursor-pointer ${
                  item.key === storageKey 
                  ? (darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200 shadow-sm')
                  : (darkMode ? 'bg-slate-900/30 border-slate-700 hover:bg-slate-900/50' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 shadow-sm')
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${item.key === storageKey ? 'text-blue-500' : (darkMode ? 'text-slate-400' : 'text-slate-500')}`}>
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEditFromList(item); }}
                      className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                      title="Edit note"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.key); }}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className={`text-sm truncate ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {item.content}
                </p>
                {item.key === storageKey && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronRight size={16} className="text-blue-500" />
                  </div>
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
