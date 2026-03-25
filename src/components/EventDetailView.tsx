import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Edit, Trash2, Plus } from 'lucide-react';
import { Event } from '../types';

interface EventDetailViewProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  onEdit,
  onDelete
}) => {
  return (
    <div className="pb-32">
      <section className="mb-8 md:mb-12">
        {event.image && (
          <div className="relative overflow-hidden rounded-xl h-48 md:h-64 mb-6 md:mb-8 botanical-shadow">
            <img 
              alt={event.title} 
              className="w-full h-full object-cover" 
              src={event.image}
              referrerPolicy="no-referrer"
            />
            {event.category && (
              <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                <span className="bg-primary-container text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                  {event.category}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tighter mb-3 md:mb-4 leading-tight">
              {event.title}
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl">
              {event.description}
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="bg-white/60 backdrop-blur-md p-5 md:p-6 rounded-xl space-y-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary-container shrink-0" />
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Date</p>
                  <p className="text-sm md:text-base font-bold text-on-surface">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary-container shrink-0" />
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Time</p>
                  <p className="text-sm md:text-base font-bold text-on-surface">{event.time}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <div className="md:col-span-2 bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-xl botanical-shadow border border-white/20">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <h3 className="font-bold text-lg md:text-xl">Location</h3>
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-outline" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start sm:items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shrink-0">
              <img 
                alt="Map" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcT_RdYe92iiOvds82tTb7YhAMTo75iWNtNVcfSyVz_7s5umxrc-Z1ZsgCpfQX41eoGv1mzxkEvTLkuUDrhhnbL0TzP-oPjmzuvkVY_2zBYqo4Lv1x4633HhudzkpT4KoEPf707yrxL1o5LUd9X9_wxxKuPuStLw294T5NDiippOghH7xcKkCXcjjbdgYuBLe40Jvyl7taxBDITzBCcO9KlpCOYgVFez3cX5gx8MI0QQrNG7E9bCOf8rlvINBhTTmNtCW-2-acuYE"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="font-bold text-on-surface text-base md:text-lg">{event.location}</p>
              <p className="text-on-surface-variant text-xs md:text-sm">{event.address}</p>
              <button className="mt-2 md:mt-3 text-primary-container text-xs md:text-sm font-bold flex items-center gap-1 hover:underline">
                Get Directions <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-secondary-container/40 backdrop-blur-md p-6 md:p-8 rounded-xl border border-white/20">
          <h3 className="font-bold text-lg md:text-xl mb-4 md:mb-6">Focus Tags</h3>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span key={tag} className="bg-white/80 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h3 className="font-extrabold text-xl md:text-2xl mb-6 md:mb-8 flex items-center gap-3">
          Collaborators
          <span className="text-xs md:text-sm font-normal text-on-surface-variant">/ {event.collaborators.length} members</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {event.collaborators.map((collab) => (
            <div key={collab.id} className="bg-white/50 backdrop-blur-sm p-3 md:p-4 rounded-xl flex items-center gap-3 hover:bg-white/70 cursor-pointer border border-white/20">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden shrink-0">
                <img alt={collab.name} className="w-full h-full object-cover" src={collab.avatar} referrerPolicy="no-referrer" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{collab.name}</p>
                <p className="text-[9px] md:text-[10px] text-on-surface-variant uppercase font-medium truncate">{collab.role}</p>
              </div>
            </div>
          ))}
          <div className="border-2 border-dashed border-primary/30 p-3 md:p-4 rounded-xl flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary hover:border-primary cursor-pointer bg-white/30 backdrop-blur-sm">
            <Plus className="w-3.5 h-3.5" />
            <p className="text-sm font-bold">Invite</p>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-xl flex flex-col sm:flex-row justify-center items-center gap-2 md:gap-4 z-40 border-t border-outline-variant/15 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={onEdit}
          className="w-full sm:w-64 py-3 md:py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 text-sm md:text-base"
        >
          <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Edit Event
        </button>
        <button 
          onClick={onDelete}
          className="w-full sm:w-64 py-3 md:py-4 bg-error-container text-error rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-error hover:text-white text-sm md:text-base"
        >
          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Delete Event
        </button>
      </div>
    </div>
  );
};
