import React, { useState, useRef } from 'react';
import { Calendar, Clock, MapPin, ChevronDown, UserPlus, X, Sparkles, Upload, Loader2 } 
import { Event } from '../types';
import { COLLABORATORS } from '../constants';

interface CreateEventViewProps {
  onCancel: () => void;
  onSubmit: (event: Event) => void;
  initialEvent?: Event;
  onDelete?: () => void;
}

export const CreateEventView: React.FC<CreateEventViewProps> = ({
  onCancel,
  onSubmit,
  initialEvent,
  onDelete
}) => {
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [date, setDate] = useState(() => {
    if (initialEvent?.date === 'TBD') return '';
    if (initialEvent?.date) {
      try {
        const d = new Date(initialEvent.date);
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      } catch (e) {}
    }
    return '';
  });
  const [time, setTime] = useState(initialEvent?.time === 'TBD' ? '' : initialEvent?.time || '');
  const [department, setDepartment] = useState(initialEvent?.department || 'ASSIST');
  const [location, setLocation] = useState(initialEvent?.location === 'TBD' ? '' : initialEvent?.location || '');
  const [image, setImage] = useState<string | null>(initialEvent?.image || null);
  const [isDateTBD, setIsDateTBD] = useState(initialEvent?.date === 'TBD');
  const [isTimeTBD, setIsTimeTBD] = useState(initialEvent?.time === 'TBD');
  const [selectedCollaborators, setSelectedCollaborators] = useState<any[]>(initialEvent?.collaborators || []);
  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) { alert("Please fill in the event name."); return; }
    if (!isDateTBD && !date) { alert("Please select a date or check TBD."); return; }
    if (!isTimeTBD && !time) { alert("Please select a time or check TBD."); return; }

    let formattedDate = 'TBD';
    if (!isDateTBD && date) {
      const dateObj = new Date(date);
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      formattedDate = `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    }

    const newEvent: Event = {
      id: initialEvent?.id || Math.random().toString(36).substr(2, 9),
      title,
      description: description || 'No description provided.',
      date: formattedDate,
      time: isTimeTBD ? 'TBD' : time,
      duration: initialEvent?.duration || '1h',
      type: initialEvent?.type || 'Internal',
      department,
      location: location || 'TBD',
      address: location || 'TBD',
      tags: [department],
      image: image || undefined,
      collaborators: selectedCollaborators,
    };

    onSubmit(newEvent);
  };

  const toggleCollaborator = (collab: typeof COLLABORATORS[0]) => {
    setSelectedCollaborators(prev =>
      prev.find(c => c.id === collab.id)
        ? prev.filter(c => c.id !== collab.id)
        : [...prev, collab]
    );
  };


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const inputClass = "w-full bg-[#ece5db] border-none rounded-xl p-3.5 md:p-4 text-sm md:text-base text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/40 outline-none";

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
          {initialEvent ? 'Edit event' : 'Add new event'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 md:gap-6 pb-32">

        {/* Event Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Event Name</label>
          <input
            className={inputClass}
            placeholder="e.g. Quarterly Strategic Alignment"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Description</label>
          <textarea
            className={`${inputClass} min-h-[100px] resize-none`}
            placeholder="Describe the event..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Event Visual — just two buttons */}
      {/* Event Visual — upload only */}
<div className="flex flex-col gap-2">
  <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Event Visual</label>
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="flex items-center gap-2 px-4 py-2.5 bg-[#ece5db] text-primary rounded-xl text-xs font-bold hover:bg-[#e0d8cc]"
    >
      <Upload className="w-3.5 h-3.5" />
      Upload Image
    </button>
    {image && (
      <button
        type="button"
        onClick={() => setImage(null)}
        className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-100"
      >
        <X className="w-3.5 h-3.5" />
        Remove
      </button>
    )}
  </div>
  {image && (
    <div className="relative aspect-[3/1] w-full rounded-xl overflow-hidden mt-1">
      <img src={image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
    </div>
  )}
  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
</div>

        {/* Date + Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Date</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary/40"
                  type="checkbox"
                  checked={isDateTBD}
                  onChange={(e) => setIsDateTBD(e.target.checked)}
                />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">TBD</span>
              </label>
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
              <input
                className={`${inputClass} pl-11 md:pl-12 disabled:opacity-50`}
                type="date"
                required={!isDateTBD}
                disabled={isDateTBD}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Time</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary/40"
                  type="checkbox"
                  checked={isTimeTBD}
                  onChange={(e) => setIsTimeTBD(e.target.checked)}
                />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">TBD</span>
              </label>
            </div>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
              <select
                className={`${inputClass} pl-11 md:pl-12 appearance-none disabled:opacity-50`}
                required={!isTimeTBD}
                disabled={isTimeTBD}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Select time (15m intervals)</option>
                {Array.from({ length: 24 * 4 }).map((_, i) => {
                  const h = Math.floor(i / 4).toString().padStart(2, '0');
                  const m = ((i % 4) * 15).toString().padStart(2, '0');
                  const t = `${h}:${m}`;
                  return <option key={t} value={t}>{t}</option>;
                })}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Event Type + Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Event Type</label>
            <div className="relative">
              <select className={`${inputClass} appearance-none`}>
                <option>Internal</option>
                <option>External</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Department</label>
            <div className="relative">
              <select
                className={`${inputClass} appearance-none`}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option>ASSIST</option>
                <option>Fundație</option>
                <option>Sports Club</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Team Members</label>
          <div className="relative">
            <div className="w-full bg-[#ece5db] rounded-xl p-2 min-h-[52px] md:min-h-[56px] flex flex-wrap gap-2 items-center">
              {selectedCollaborators.map(collab => (
                <span key={collab.id} className="bg-white/70 text-on-surface px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1">
                  {collab.name}
                  <button className="p-0.5 hover:bg-black/5 rounded-full" type="button" onClick={() => toggleCollaborator(collab)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <div className="relative flex-grow">
                <input
                  className="w-full bg-transparent border-none focus:ring-0 p-1.5 md:p-2 text-sm outline-none"
                  placeholder={selectedCollaborators.length > 0 ? "Add more..." : "Add members..."}
                  type="text"
                  value={memberSearch}
                  onChange={(e) => { setMemberSearch(e.target.value); setShowMemberDropdown(true); }}
                  onFocus={() => setShowMemberDropdown(true)}
                />
                {showMemberDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-[#ece5db] rounded-xl shadow-xl border border-white/20 z-[100] max-h-[200px] overflow-y-auto botanical-shadow">
                    <div className="p-4 text-center text-xs text-on-surface-variant">No members found (Join a team first)</div>
                  </div>
                )}
              </div>
              <UserPlus className="text-on-surface-variant px-2 w-9 h-5 md:w-10 md:h-6" />
            </div>
            {showMemberDropdown && (
              <div className="fixed inset-0 z-40" onClick={() => setShowMemberDropdown(false)} />
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
            <input
              className={`${inputClass} pl-11 md:pl-12`}
              placeholder="Meeting Room Alpha or Virtual Link"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 md:pt-4 space-y-3">
          <button
            className="w-full h-12 md:h-14 bg-gradient-to-br from-primary to-primary-container text-white text-sm md:text-base font-bold rounded-xl shadow-[0_8px_16px_rgba(122,0,43,0.25)]"
            type="submit"
          >
            {initialEvent ? 'Save Changes' : 'Create Event'}
          </button>

          {initialEvent && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full h-12 md:h-14 bg-[#ece5db] text-red-500 text-sm md:text-base font-bold rounded-xl border border-red-100 hover:bg-red-50"
            >
              Delete Event
            </button>
          )}

          <button
            onClick={onCancel}
            className="w-full h-12 md:h-14 text-on-surface-variant text-sm md:text-base font-bold hover:bg-black/5 rounded-xl"
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
