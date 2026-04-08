import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Save, CheckCircle2, Trash2, CalendarRange, ListTodo, Plus, ChevronRight, Edit2 } from 'lucide-react';
import { format, parse, isWithinInterval, areIntervalsOverlapping } from 'date-fns';

const NotesPanel = ({ darkMode, startDate, endDate, onSelectRange, allNotes, onUpdateNotes }) => {
  const [noteInput, setNoteInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Helper to parse dateKey into an interval
  const getIntervalFromKey = (key) => {
    if (key === 'global') return null;
    const parts = key.split('-to-');
    if (parts.length === 2) {
      return {
        start: parse(parts[0], 'yyyy-MM-dd', new Date()),
        end: parse(parts[1], 'yyyy-MM-dd', new Date())
      };
    } else {
      const d = parse(parts[0], 'yyyy-MM-dd', new Date());
      return { start: d, end: d };
    }
  };

  // Generate date key based on selected range
  const dateKey = useMemo(() => {
    if (!startDate) return 'global';
    const startStr = format(startDate, 'yyyy-MM-dd');
    if (!endDate) return startStr;
    const endStr = format(endDate, 'yyyy-MM-dd');
    return `${startStr}-to-${endStr}`;
  }, [startDate, endDate]);

  const currentInterval = useMemo(() => {
    if (!startDate) return null;
    return { start: startDate, end: endDate || startDate };
  }, [startDate, endDate]);

  const rangeTitle = useMemo(() => {
    if (!startDate) return 'General Memos';
    const startStr = format(startDate, 'MMM d');
    if (!endDate) return `Notes for ${startStr}`;
    const endStr = format(endDate, 'MMM d');
    return `Notes: ${startStr} → ${endStr}`;
  }, [startDate, endDate]);

  // Filter notes for the currently selected date range (including overlaps)
  const currentRangeNotes = useMemo(() => {
    if (!currentInterval) {
      return allNotes.filter(n => n.dateKey === 'global');
    }
    return allNotes.filter(n => {
      if (n.dateKey === 'global') return false;
      const noteInterval = getIntervalFromKey(n.dateKey);
      if (!noteInterval) return false;
      return areIntervalsOverlapping(currentInterval, noteInterval);
    });
  }, [allNotes, currentInterval]);

  // Group all notes for the "Collection" view (all unique date keys)
  const groupedCollection = useMemo(() => {
    const groups = {};
    allNotes.forEach(note => {
      if (!groups[note.dateKey]) {
        groups[note.dateKey] = {
          dateKey: note.dateKey,
          notes: [],
          title: ''
        };
        // Generate title for the group
        if (note.dateKey === 'global') {
          groups[note.dateKey].title = 'General Memos';
        } else {
          const parts = note.dateKey.split('-to-');
          if (parts.length === 2) {
            const s = parse(parts[0], 'yyyy-MM-dd', new Date());
            const e = parse(parts[1], 'yyyy-MM-dd', new Date());
            groups[note.dateKey].title = `${format(s, 'MMM d')} - ${format(e, 'MMM d')}`;
          } else {
            const s = parse(parts[0], 'yyyy-MM-dd', new Date());
            groups[note.dateKey].title = format(s, 'MMM d');
          }
        }
      }
      groups[note.dateKey].notes.push(note);
    });
    return Object.values(groups);
  }, [allNotes]);

  const handleSave = () => {
    if (noteInput.trim() === '') return;

    let updatedNotes;
    if (editingNoteId) {
      // Edit existing note
      updatedNotes = allNotes.map(n => 
        n.id === editingNoteId ? { ...n, content: noteInput, timestamp: Date.now() } : n
      );
      setEditingNoteId(null);
    } else {
      // Add new note
      const newNote = {
        id: Date.now().toString(),
        dateKey,
        content: noteInput,
        timestamp: Date.now()
      };
      updatedNotes = [newNote, ...allNotes];
    }

    onUpdateNotes(updatedNotes);
    setNoteInput('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this note?')) {
      const updatedNotes = allNotes.filter(n => n.id !== id);
      onUpdateNotes(updatedNotes);
      if (editingNoteId === id) {
        setEditingNoteId(null);
        setNoteInput('');
      }
    }
  };

  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setNoteInput(note.content);
    // If not already on this date range, switch to it
    if (note.dateKey !== dateKey) {
      if (note.dateKey === 'global') {
        onSelectRange(null, null);
      } else {
        const parts = note.dateKey.split('-to-');
        if (parts.length === 2) {
          onSelectRange(parse(parts[0], 'yyyy-MM-dd', new Date()), parse(parts[1], 'yyyy-MM-dd', new Date()));
        } else {
          onSelectRange(parse(parts[0], 'yyyy-MM-dd', new Date()), null);
        }
      }
    }
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setNoteInput('');
  };

  return (
    <div className={`rounded-[2rem] shadow-2xl p-6 md:p-8 flex flex-col h-full transition-all duration-700 overflow-hidden glass-effect min-w-0 w-full ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      
      {/* Input Section */}
      <div className="flex flex-col gap-6 mb-8 flex-shrink-0 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black tracking-tight whitespace-nowrap">
              {editingNoteId ? 'Edit Note' : (startDate ? 'Add Note' : 'New Memo')}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {editingNoteId && (
              <button 
                onClick={cancelEdit}
                className={`text-[10px] font-black uppercase px-3 py-2 rounded-xl border transition-all ${darkMode ? 'border-slate-700 text-slate-500 hover:bg-slate-800' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!noteInput.trim()}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Save size={16} />
              {editingNoteId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
        
        <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border transition-all truncate max-w-full ${darkMode ? 'bg-slate-900/50 border-slate-700/50 text-blue-400' : 'bg-blue-50 border-blue-100/50 text-blue-600'}`}>
          {rangeTitle}
        </div>

        <div className="relative group">
          <textarea
            className={`w-full p-5 border rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-none font-medium h-32 transition-all text-sm leading-relaxed block ${darkMode ? 'bg-slate-950/50 border-slate-800 text-slate-300 placeholder-slate-700' : 'bg-white/50 border-slate-100 text-slate-700 placeholder-slate-400'}`}
            placeholder={editingNoteId ? "Update your note..." : "Add a new note for this selection..."}
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
          <div className={`absolute bottom-4 right-4 transition-all duration-500 transform ${isSaved ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl ${darkMode ? 'text-emerald-400 bg-slate-900 border-emerald-500/30' : 'text-emerald-600 bg-white border-emerald-100'}`}>
              <CheckCircle2 size={14} className="animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest">Saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Selection List */}
      {currentRangeNotes.length > 0 && (
        <div className="flex flex-col gap-4 mb-8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Related Notes ({currentRangeNotes.length})
            </h4>
            {!editingNoteId && (
              <button 
                onClick={() => setNoteInput('')}
                className={`flex items-center gap-1 text-[10px] font-black uppercase transition-all ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                <Plus size={12} />
                Add Another
              </button>
            )}
          </div>
          <div className="space-y-3">
            {currentRangeNotes.map(note => {
              const isExactMatch = note.dateKey === dateKey;
              return (
                <div key={note.id} className={`p-4 rounded-2xl border transition-all ${
                  isExactMatch 
                  ? (darkMode ? 'bg-blue-600/10 border-blue-500/30 shadow-lg shadow-blue-500/5' : 'bg-blue-50 border-blue-100 shadow-sm')
                  : (darkMode ? 'bg-slate-800/40 border-slate-700/50 opacity-80' : 'bg-slate-50/80 border-slate-100 opacity-80')
                }`}>
                  <div className="flex flex-col gap-2">
                    {!isExactMatch && (
                      <div className={`text-[9px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {getIntervalFromKey(note.dateKey) ? (
                          `${format(getIntervalFromKey(note.dateKey).start, 'MMM d')} - ${format(getIntervalFromKey(note.dateKey).end, 'MMM d')}`
                        ) : 'General'}
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm leading-relaxed">{note.content}</p>
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEditing(note)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 transition-colors">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => handleDelete(note.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Saved Notes History List */}
      <div className="flex flex-col gap-6 overflow-hidden flex-1">
        <div className="flex items-center justify-between border-t border-slate-200/20 pt-8 mb-2">
          <div className="flex items-center gap-2">
            <ListTodo size={18} className="text-blue-500" />
            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Full Collection
            </h4>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
            {groupedCollection.length}
          </span>
        </div>

        <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {groupedCollection.length === 0 ? (
            <div className={`text-center py-10 space-y-3 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`}>
              <div className="flex justify-center">
                <CalendarRange size={32} strokeWidth={1} />
              </div>
              <p className="text-xs font-medium italic tracking-wide">Empty collection</p>
            </div>
          ) : (
            groupedCollection.map((group) => (
              <div 
                key={group.dateKey}
                onClick={() => onSelectRange(
                  group.dateKey === 'global' ? null : parse(group.dateKey.split('-to-')[0], 'yyyy-MM-dd', new Date()),
                  group.dateKey.includes('-to-') ? parse(group.dateKey.split('-to-')[1], 'yyyy-MM-dd', new Date()) : null
                )}
                className={`group relative flex flex-col p-5 rounded-[1.5rem] border transition-all duration-300 cursor-pointer ${
                  group.dateKey === dateKey 
                  ? (darkMode ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-blue-50 border-blue-200 shadow-sm')
                  : (darkMode ? 'bg-slate-900/20 border-slate-800 hover:border-slate-700' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 shadow-sm')
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${group.dateKey === dateKey ? 'text-blue-500' : (darkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                    {group.title}
                  </span>
                  <span className={`text-[10px] font-black opacity-50`}>{group.notes.length} {group.notes.length === 1 ? 'note' : 'notes'}</span>
                </div>
                <p className={`text-xs font-medium leading-relaxed truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {group.notes[0].content}
                </p>
                {group.dateKey === dateKey && (
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
