import React from 'react';
import { isSameDay, isWithinInterval, isWeekend, format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DayCell = ({ 
  day, 
  currentMonth, 
  startDate, 
  endDate, 
  onSelectDate 
}) => {
  const isSelectedStart = startDate && isSameDay(day, startDate);
  const isSelectedEnd = endDate && isSameDay(day, endDate);
  const isInRange = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });
  const isToday = isSameDay(day, new Date());
  const isWeekendDay = isWeekend(day);
  const isCurrentMonth = format(day, 'M') === format(currentMonth, 'M');

  return (
    <button
      onClick={() => onSelectDate(day)}
      className={cn(
        "relative h-12 md:h-16 flex items-center justify-center text-sm md:text-base transition-all duration-200 group overflow-hidden",
        !isCurrentMonth && "text-slate-300 pointer-events-none",
        isCurrentMonth && "hover:bg-blue-50 cursor-pointer",
        isWeekendDay && isCurrentMonth && "bg-slate-50/50",
        isInRange && "bg-blue-100/60",
        isSelectedStart && "bg-blue-600 text-white rounded-l-lg hover:bg-blue-700 shadow-md scale-105 z-10",
        isSelectedEnd && "bg-emerald-600 text-white rounded-r-lg hover:bg-emerald-700 shadow-md scale-105 z-10",
        isSelectedStart && isSelectedEnd && "rounded-lg"
      )}
    >
      <span className={cn(
        "relative z-20 font-medium",
        isToday && !isSelectedStart && !isSelectedEnd && "text-blue-600 font-bold underline decoration-2 underline-offset-4"
      )}>
        {format(day, 'd')}
      </span>
      
      {/* Subtle hover effect */}
      {isCurrentMonth && !isSelectedStart && !isSelectedEnd && (
        <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
};

export default DayCell;
