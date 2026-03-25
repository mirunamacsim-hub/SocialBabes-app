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
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setCurrentDate(newDate);
    if (viewMode === 'list') {
      const monthName = months[newDate.getMonth()];
      const element = document.getElementById(`month-${monthName}-${newDate.getFullYear()}`);
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setCurrentDate(newDate);
    if (viewMode === 'list') {
      const monthName = months[newDate.getMonth()];
      const element = document.getElementById(`month-${monthName}-${newDate.getFullYear()}`);
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
  };

  // Group events by month and then by date for the list view
  const groupedByMonth = events.reduce((acc, event) => {
    const dateObj = new Date(event.date);
    const m = dateObj.getMonth();
    const y = dateObj.getFullYear();
    const monthKey = `${months[m]} ${y}`;
    
    if (!acc[monthKey]) acc[monthKey] = {};
    if (!acc[monthKey][event.date]) acc[monthKey][event.date] = [];
    acc[monthKey][event.date].push(event);
    return acc;
  }, {} as Record<string, Record<string, Event[]>>);

  // Sort months chronologically
  const sortedMonthKeys = Object.keys(groupedByMonth).sort((a, b) => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    const dateA = new Date(parseInt(yearA), months.indexOf(monthA));
    const dateB = new Date(parseInt(yearB), months.indexOf(monthB));
    return dateA.getTime() - dateB.getTime();
  });

  // Calendar logic for grid view
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
      {/* Header Section with Fixed Height to prevent layout shifts */}
      <section className="relative h-[120px] md:h-[140px] mb-6 md:mb-8 flex flex-col items-center justify-start text-center">
        {/* Row 1: View Toggle and Add Button */}
        <div className="flex items-center justify-center gap-3 w-full h-12 z-10">
          <div className="bg-surface-container-low/60 backdrop-blur-sm p-1 rounded-xl flex border border-white/20 shadow-sm h-full transition-none">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "px-4 md:px-8 rounded-lg flex items-center justify-center gap-2 text-xs md:text-sm font-bold h-full transition-none",
                viewMode === 'list' ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-container/40"
              )}
            >
              <List className="w-3.5 h-3.5 md:w-4 md:h-4 transition-none" />
              List
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "px-4 md:px-8 rounded-lg flex items-center justify-center gap-2 text-xs md:text-sm font-semibold h-full transition-none",
                viewMode === 'grid' ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-container/40"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5 md:w-4 md:h-4 transition-none" />
              Grid
            </button>
          </div>
          <button 
            onClick={onCreateClick}
            className="bg-gradient-to-br from-primary to-primary-container text-white h-full aspect-square rounded-xl flex items-center justify-center shadow-[0_8px_16px_rgba(3,86,232,0.20)] hover:opacity-90 shrink-0 transition-none"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6 transition-none" strokeWidth={3} />
          </button>
        </div>

        {/* Row 2: Month Selector - Absolute positioned to avoid layout shift, now visible in both views for alignment */}
        <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 flex flex-col items-center w-full transition-none opacity-100">
          <div className="flex items-center justify-between w-full min-w-[240px] max-w-[280px] bg-surface-container-low/40 rounded-xl p-1.5 border border-white/10 shadow-sm transition-none">
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

      {viewMode === 'list' ? (
        <div className="space-y-6 md:space-y-8">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center transition-none">
              <div className="bg-white/30 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.02)] transition-none">
                <p className="text-xl md:text-2xl font-bold text-primary tracking-tight transition-none">
                  Add events or join a team
                </p>
              </div>
            </div>
          ) : (
            sortedMonthKeys.map((monthKey) => (
              <div key={monthKey} id={`month-${monthKey.replace(' ', '-')}`} className="space-y-4 md:space-y-6 scroll-mt-24">
                {(Object.values(groupedByMonth[monthKey]).flat() as Event[]).map((event) => (
                  <div 
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="group relative bg-surface-container-lowest/90 backdrop-blur-sm p-4 md:p-6 rounded-xl flex flex-col md:flex-row gap-3 md:gap-6 hover:bg-surface shadow-sm border border-white/40 cursor-pointer transition-none"
                  >
                    <div className="w-full md:w-32 flex-shrink-0 flex md:flex-col items-baseline md:items-start gap-1 md:gap-0 transition-none">
                      <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest leading-none mb-1">
                        {event.date.split(' ')[0].substring(0, 3)} {event.date.split(' ')[1].replace(',', '')}
                      </p>
                      <p className="text-sm md:text-base font-bold text-primary transition-none">{event.time}</p>
                    </div>
                    <div className="flex-grow space-y-2 md:space-y-3 transition-none">
                          <div className="flex justify-between items-start transition-none">
                            <h4 className="text-lg md:text-xl font-bold leading-tight group-hover:text-primary transition-none">{event.title}</h4>
                            <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5 text-on-surface-variant/30 group-hover:text-primary transition-none" />
                          </div>
                          
                          {event.image && (
                            <div className="aspect-[16/9] md:aspect-[16/6] w-full rounded-xl overflow-hidden mb-1 md:mb-2 transition-none">
                              <img 
                                alt={event.title} 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-none" 
                                src={event.image}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                          
                          <p className="text-on-surface-variant text-sm leading-relaxed max-w-md line-clamp-2">
                            {event.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 pt-2">
                            {event.collaborators.map((collab) => (
                              <div key={collab.id} className="flex items-center gap-1.5 bg-secondary-container/50 px-3 py-1 rounded-full">
                                <div className="w-5 h-5 rounded-full bg-slate-300 overflow-hidden border border-white/50">
                                  <img alt={collab.name} className="w-full h-full object-cover" src={collab.avatar} referrerPolicy="no-referrer" />
                                </div>
                                <span className="text-[11px] font-bold text-on-secondary-container">{collab.name}</span>
                              </div>
                            ))}
                            <div className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full">
                              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{event.department}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-surface-container-lowest/90 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/40 shadow-sm">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center transition-none">
                  <div className="bg-white/30 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.02)] transition-none">
                    <p className="text-xl md:text-2xl font-bold text-primary tracking-tight transition-none">
                      Add events or join a team
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-[10px] md:text-xs font-bold text-on-surface-variant uppercase py-2">
                        {day}
                      </div>
                    ))}
                  </div>
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
                            "aspect-square rounded-xl p-1 md:p-2 border border-outline-variant/10 flex flex-col gap-1 hover:bg-primary/5 cursor-default transition-none",
                            dayEvents.length > 0 ? "bg-primary/5" : "bg-transparent"
                          )}
                        >
                          <span className="text-[10px] md:text-xs font-bold text-on-surface-variant transition-none">{day}</span>
                          <div className="flex flex-col gap-0.5 overflow-hidden transition-none">
                            {dayEvents.map(event => (
                              <div 
                                key={event.id}
                                onClick={() => onEventClick(event)}
                                className="w-full h-1 md:h-1.5 rounded-full bg-primary cursor-pointer transition-none"
                                title={event.title}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
    </div>
  );
};
