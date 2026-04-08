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

const CalendarGrid = ({ currentMonth, startDate, endDate, onSelectDate }) => {
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
    <div className="w-full bg-white p-4 md:p-8 rounded-b-2xl shadow-xl border border-slate-100">
      {/* Selection Info */}
      <div className="mb-6 h-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          {startDate && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {format(startDate, 'MMM d, yyyy')}
              </span>
              {endDate && (
                <>
                  <span className="text-slate-400">→</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                    {format(endDate, 'MMM d, yyyy')}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        {!startDate && <p className="text-sm text-slate-400">Select a date range</p>}
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 border-l border-t border-slate-100 rounded-lg overflow-hidden">
        {days.map((day, idx) => (
          <div key={day.toString()} className="border-r border-b border-slate-100">
            <DayCell
              day={day}
              currentMonth={currentMonth}
              startDate={startDate}
              endDate={endDate}
              onSelectDate={onSelectDate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
