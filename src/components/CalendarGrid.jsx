import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format,
  isSameDay
} from 'date-fns';
import DayCell from './DayCell';

const CalendarGrid = ({ currentMonth, startDate, endDate, onSelectDate, darkMode }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDateInGrid = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const endDateInGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDateInGrid,
    end: endDateInGrid,
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full transition-all duration-500 overflow-hidden">
      {/* Selection Info */}
      <div className="mb-6 h-12 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          {startDate ? (
            <div className="flex items-center gap-2 animate-in slide-in-from-left-4 duration-500">
              <div className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border ${darkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                {format(startDate, 'MMM d, yyyy')}
              </div>
              {endDate && (
                <>
                  <div className={`h-px w-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                  <div className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border ${darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {format(endDate, 'MMM d, yyyy')}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
              Select Range
            </div>
          )}
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day) => (
          <div key={day} className={`text-center text-[10px] font-black uppercase tracking-[0.2em] pb-3 transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={`grid grid-cols-7 border-t border-l rounded-3xl overflow-hidden transition-all duration-500 ${darkMode ? 'border-slate-800/50 bg-slate-900/20' : 'border-slate-100 bg-slate-50/30'}`}>
        {days.map((day, idx) => (
          <div key={day.toString()} className={`border-r border-b transition-colors ${darkMode ? 'border-slate-800/50' : 'border-slate-100'}`}>
            <DayCell
              day={day}
              currentMonth={currentMonth}
              startDate={startDate}
              endDate={endDate}
              onSelectDate={onSelectDate}
              darkMode={darkMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
