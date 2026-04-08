import React from 'react';
import { isSameDay, isWithinInterval, isWeekend, format } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DayCell = ({ 
  day, 
  currentMonth, 
  startDate, 
  endDate, 
  onSelectDate,
  darkMode
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
        "relative h-14 md:h-20 flex flex-col items-center justify-center transition-all duration-300 group overflow-hidden",
        !isCurrentMonth && (darkMode ? "opacity-10 pointer-events-none" : "opacity-20 pointer-events-none"),
        isCurrentMonth && "cursor-pointer",
        isWeekendDay && isCurrentMonth && (darkMode ? "bg-slate-800/20" : "bg-slate-100/30"),
        isInRange && (darkMode ? "bg-blue-600/20" : "bg-blue-100/50"),
        isSelectedStart && "bg-blue-600 text-white z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]",
        isSelectedEnd && "bg-emerald-600 text-white z-10 shadow-[0_0_20px_rgba(16,185,129,0.4)]",
        isSelectedStart && !isSelectedEnd && "rounded-l-2xl",
        isSelectedEnd && !isSelectedStart && "rounded-r-2xl",
        isSelectedStart && isSelectedEnd && "rounded-2xl scale-95"
      )}
    >
      <span className={cn(
        "relative z-20 text-sm md:text-base font-black tracking-tighter transition-colors",
        isToday && !isSelectedStart && !isSelectedEnd && "text-blue-500"
      )}>
        {format(day, 'd')}
      </span>
      
      {isToday && !isSelectedStart && !isSelectedEnd && (
        <div className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      )}
      
      {/* Subtle hover effect */}
      {isCurrentMonth && !isSelectedStart && !isSelectedEnd && (
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300",
          darkMode ? "bg-white/5" : "bg-blue-600/5"
        )} />
      )}
    </button>
  );
};

export default DayCell;
