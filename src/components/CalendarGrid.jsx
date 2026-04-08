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
    <div className={`w-full p-4 md:p-8 rounded-b-2xl shadow-xl border transition-colors duration-500 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      {/* Selection Info */}
      <div className="mb-6 h-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          {startDate && (
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                {format(startDate, 'MMM d, yyyy')}
              </span>
              {endDate && (
                <>
                  <span className={darkMode ? 'text-slate-600' : 'text-slate-400'}>→</span>
                  <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                    {format(endDate, 'MMM d, yyyy')}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        {!startDate && <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Select a date range</p>}
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day) => (
          <div key={day} className={`text-center text-xs font-bold uppercase tracking-wider pb-2 border-b transition-colors ${darkMode ? 'text-slate-500 border-slate-700' : 'text-slate-400 border-slate-100'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={`grid grid-cols-7 border-l border-t rounded-lg overflow-hidden transition-colors ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        {days.map((day, idx) => (
          <div key={day.toString()} className={`border-r border-b transition-colors ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
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
