import React, { useState } from 'react';
import { Plus, List, LayoutGrid, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../types';
import { cn } from '../lib/utils';

interface ScheduleViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onCreateClick: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  events,
  onEventClick,
  onCreateClick
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setCurrentDate(new Date(currentYear, newMonth, 1));
    if (viewMode === 'list') {
      const monthName = months[newMonth];
      const element = document.getElementById(`month-${monthName}-${currentYear}`);
      if (element) element.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setCurrentDate(newDate);
    if (viewMode === 'list') {
      const monthName = months[newDate.getMonth()];
      const element = document.getElementById(`month-${monthName}-${newDate.getFullYear()}`);
      if (element) element.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setCurrentDate(newDate);
    if (viewMode === 'list') {
      const monthName = months[newDate.getMonth()];
      const element = document.getElementById(`month-${monthName}-${newDate.getFullYear()}`);
      if (element) element.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  };

  const groupedByMonth = events.reduce((acc, event) => {
    let monthKey: string;
    if (event.date === 'TBD') {
      monthKey = 'TBD';
    } else {
      const dateObj = new Date(event.date);
      const m = dateObj.getMonth();
      const y = dateObj.getFullYear();
      monthKey = `${months[m]} ${y}`;
    }
    if (!acc[monthKey]) acc[monthKey] = {};
    const dateKey = event.date;
    if (!acc[monthKey][dateKey]) acc[monthKey][dateKey] = [];
    acc[monthKey][dateKey].push(event);
    return acc;
  }, {} as Record<string, Record<string, Event[]>>);

  const sortedMonthKeys = Object.keys(groupedByMonth).sort((a, b) => {
    if (a === 'TBD') return 1;
    if (b === 'TBD') return -1;
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    const dateA = new Date(parseInt(yearA), months.indexOf(monthA));
    const dateB = new Date(parseInt(yearB), months.indexOf(monthB));
    return dateA.getTime() - dateB.getTime();
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getEventsForDay = (day: number) => {
    const monthName = months[currentMonth];
    const dateStr = `${monthName} ${day}, ${currentYear}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div>
      {/* Header */}
      <section className="relative h-[100px] md:h-[120px] mb-4 md:mb-6 flex flex-col items-center justify-start text-center">
        {/* Row 1: View Toggle + Add Button */}
        <div className="flex items-center justify-center gap-3 w-full h-10 md:h-12 z-10">
          <div className="bg-[#ece5db] p-1 rounded-xl flex border border-white/20 shadow-sm h-full transition-none">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "px-4 md:px-8 rounded-lg flex items-center justify-center gap-2 text-xs md:text-sm font-bold h-full transition-none",
                viewMode === 'list' ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:bg-white/40"
              )}
            >
              <List className="w-3.5 h-3.5 md:w-4 md:h-4 transition-none" />
              List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "px-4 md:px-8 rounded-lg flex items-center justify-center gap-2 text-xs md:text-sm font-semibold h-full transition-none",
                viewMode === 'grid' ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:bg-white/40"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5 md:w-4 md:h-4 transition-none" />
              Grid
            </button>
          </div>
          <button
            onClick={onCreateClick}
            className="bg-gradient-to-br from-primary to-primary-container text-white h-full aspect-square rounded-xl flex items-center justify-center shadow-[0_8px_16px_rgba(122,0,43,0.20)] hover:opacity-90 shrink-0 transition-none"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6 transition-none" strokeWidth={3} />
          </button>
        </div>

        {/* Row 2: Month Selector */}
        <div className="absolute top-14 md:top-16 left-1/2 -translate-x-1/2 flex flex-col items-center w-full transition-none">
          <div className="flex items-center justify-between w-full min-w-[240px] max-w-[280px] bg-[#ece5db] rounded-xl p-1.5 border border-white/10 shadow-sm transition-none">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-black/5 rounded-lg transition-none">
              <ChevronLeft className="w-5 h-5 text-primary transition-none" />
            </button>
            <select
              value={currentMonth}
              onChange={handleMonthSelect}
              className="bg-transparent text-sm font-black uppercase tracking-widest outline-none cursor-pointer px-2 text-primary text-center appearance-none transition-none"
            >
              {months.map((m, i) => (
                <option key={m} value={i} className="text-on-surface font-normal">{m.substring(0, 3)}</option>
              ))}
            </select>
            <button onClick={handleNextMonth} className="p-2 hover:bg-black/5 rounded-lg transition-none">
              <ChevronRight className="w-5 h-5 text-primary transition-none" />
            </button>
          </div>
        </div>
      </section>

      {/* Empty State */}
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
          <div className="bg-[#ece5db] px-6 py-4 md:px-8 md:py-6 rounded-2xl border border-white/50 shadow-sm w-full max-w-[320px]">
            <p className="text-base md:text-lg font-bold text-primary tracking-tight">
              Add events or join a team
            </p>
          </div>
        </div>

      ) : viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="space-y-6 md:space-y-8">
          {sortedMonthKeys.map((monthKey) => (
            <div
              key={monthKey}
              id={`month-${monthKey.replace(' ', '-')}`}
              className="space-y-3 md:space-y-4 scroll-mt-24"
            >
              {/* Month Label */}
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary/50 px-1">
                {monthKey}
              </h3>

              {(Object.values(groupedByMonth[monthKey]).flat() as Event[]).map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="group relative bg-[#ece5db] p-4 md:p-6 rounded-xl flex flex-col md:flex-row gap-3 md:gap-6 hover:bg-[#e0d8cc] shadow-sm border border-white/40 cursor-pointer transition-none"
                >
                  {/* Date/Time Column */}
                  <div className="w-full md:w-32 flex-shrink-0 flex md:flex-col items-baseline md:items-start gap-2 md:gap-0">
                    <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest leading-none md:mb-1">
                      {event.date === 'TBD' ? 'TBD' : `${event.date.split(' ')[0].substring(0, 3)} ${event.date.split(' ')[1]?.replace(',', '')}`}
                    </p>
                    <p className="text-sm md:text-base font-bold text-primary">{event.time}</p>
                  </div>

                  {/* Content Column */}
                  <div className="flex-grow space-y-2 md:space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-base md:text-lg font-bold leading-tight group-hover:text-primary">{event.title}</h4>
                      <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5 text-on-surface-variant/30 group-hover:text-primary shrink-0 ml-2" />
                    </div>

                    {event.image && (
                      <div className="aspect-[16/6] w-full rounded-xl overflow-hidden">
                        <img
                          alt={event.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                          src={event.image}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {event.collaborators.map((collab) => (
                        <div key={collab.id} className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full">
                          <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-slate-300 overflow-hidden border border-white/50">
                            <img alt={collab.name} className="w-full h-full object-cover" src={collab.avatar} referrerPolicy="no-referrer" />
                          </div>
                          <span className="text-[10px] md:text-[11px] font-bold text-on-surface">{collab.name}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full">
                        <span className="text-[10px] md:text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{event.department}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      ) : (
        /* GRID/CALENDAR VIEW */
        <div className="bg-[#ece5db] rounded-xl p-3 md:p-6 border border-white/40 shadow-sm overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2 md:mb-3">
            {[ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-[9px] md:text-[11px] font-bold text-on-surface-variant uppercase py-1 md:py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map(day => {
              const dayEvents = getEventsForDay(day);
              return (
                <div
                  key={day}
                  className={cn(
                    "aspect-square rounded-lg md:rounded-xl p-1 md:p-2 border border-black/5 flex flex-col gap-0.5 transition-none",
                    dayEvents.length > 0 ? "bg-primary/10 cursor-pointer hover:bg-primary/15" : "bg-white/30 cursor-default"
                  )}
                >
                  <span className={cn(
                    "text-[9px] md:text-xs font-bold",
                    dayEvents.length > 0 ? "text-primary" : "text-on-surface-variant"
                  )}>
                    {day}
                  </span>
                  <div className="flex flex-wrap gap-0.5 overflow-hidden">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary cursor-pointer shadow-sm"
                        title={event.title}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
