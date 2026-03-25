import React, { useState, useRef } from 'react';
import { Calendar, Clock, MapPin, ChevronDown, UserPlus, X, Sparkles, Upload, Loader2 } from 'lucide-react';
import { Event } from '../types';
import { COLLABORATORS } from '../constants';
import { GoogleGenAI } from "@google/genai";

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
      // Try to parse the date string back to YYYY-MM-DD
      try {
        const d = new Date(initialEvent.date);
        if (!isNaN(d.getTime())) {
          return d.toISOString().split('T')[0];
        }
      } catch (e) {}
    }
    return '';
  });
  const [time, setTime] = useState(initialEvent?.time === 'TBD' ? '' : initialEvent?.time || '');
  const [department, setDepartment] = useState(initialEvent?.department || 'ASSIST');
  const [location, setLocation] = useState(initialEvent?.location === 'TBD' ? '' : initialEvent?.location || '');
  const [image, setImage] = useState<string | null>(initialEvent?.image || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDateTBD, setIsDateTBD] = useState(initialEvent?.date === 'TBD');
  const [isTimeTBD, setIsTimeTBD] = useState(initialEvent?.time === 'TBD');
  const [selectedCollaborators, setSelectedCollaborators] = useState<any[]>(initialEvent?.collaborators || []);
  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Please fill in the event name.");
      return;
    }
    if (!isDateTBD && !date) {
      alert("Please select a date or check TBD.");
      return;
    }
    if (!isTimeTBD && !time) {
      alert("Please select a time or check TBD.");
      return;
    }

    let formattedDate = 'TBD';
    if (!isDateTBD && date) {
      const dateObj = new Date(date);
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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

  const handleGenerateAI = async () => {
    if (!title) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `A high-quality, professional, and aesthetically pleasing image representing the event titled: "${title}". Style: modern, clean, botanical accents, professional photography. IMPORTANT: The image must NOT contain any text, writing, letters, or numbers. It should be a pure visual representation.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setImage(`data:image/png;base64,${base64EncodeString}`);
          break;
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
          {initialEvent ? 'Edit event' : 'Add new event'}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 md:gap-8 pb-32">

        <div className="flex flex-col gap-1.5 md:gap-2">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Event Name</label>
          <input 
            className="w-full bg-white/60 backdrop-blur-sm border-none rounded-xl p-3.5 md:p-4 text-sm md:text-base text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 outline-none" 
            placeholder="e.g. Quarterly Strategic Alignment" 
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:gap-2">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Description</label>
          <textarea 
            className="w-full bg-white/60 backdrop-blur-sm border-none rounded-xl p-3.5 md:p-4 text-sm md:text-base text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 outline-none min-h-[100px] resize-none" 
            placeholder="Describe the event..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:gap-2">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Event Visual</label>
          <div className="relative aspect-[16/9] w-full bg-white/40 backdrop-blur-sm rounded-xl overflow-hidden border border-dashed border-primary/20 group">
            {image ? (
              <>
                <img src={image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={!title || isGenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    AI Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/80 text-primary rounded-xl text-xs font-bold hover:bg-white"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </button>
                </div>
                <p className="text-[10px] text-on-surface-variant font-medium">
                  {!title ? "Enter a title first to use AI generation" : "Generate a custom visual or upload your own"}
                </p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:gap-6">
          <div className="flex flex-col gap-1.5 md:gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Date</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-outline-variant text-primary-container focus:ring-primary/40" 
                  type="checkbox" 
                  checked={isDateTBD}
                  onChange={(e) => setIsDateTBD(e.target.checked)}
                />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">TBD</span>
              </label>
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-container w-4 h-4 md:w-4.5 md:h-4.5" />
              <input 
                className="w-full bg-white/60 backdrop-blur-sm border-none rounded-xl p-3.5 md:p-4 pl-11 md:pl-12 text-sm md:text-base text-on-surface focus:ring-2 focus:ring-primary/40 outline-none disabled:opacity-50" 
                type="date"
                required={!isDateTBD}
                disabled={isDateTBD}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 md:gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Time</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-outline-variant text-primary-container focus:ring-primary/40" 
                  type="checkbox" 
                  checked={isTimeTBD}
                  onChange={(e) => setIsTimeTBD(e.target.checked)}
                />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">TBD</span>
              </label>
            </div>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-container w-4 h-4 md:w-4.5 md:h-4.5" />
              <select 
                className="w-full bg-white/60 backdrop-blur-sm border-none rounded-xl p-3.5 md:p-4 pl-11 md:pl-12 text-sm md:text-base text-on-surface appearance-none focus:ring-2 focus:ring-primary/40 outline-none disabled:opacity-50"
                required={!isTimeTBD}
                disabled={isTimeTBD}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Select time (15m intervals)</option>
                {Array.from({ length: 24 * 4 }).map((_, i) => {
                  const hours = Math.floor(i / 4).toString().padStart(2, '0');
                  const minutes = ((i % 4) * 15).toString().padStart(2, '0');
                  const time = `${hours}:${minutes}`;
                  return <option key={time} value={time}>{time}</option>;
                })}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4 md:w-4.5 md:h-4.5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Event Type</label>
            <div className="relative">
              <select className="w-full bg-white/60 backdrop-blur-sm border-none rounded-xl p-3.5 md:p-4 text-sm md:text-base text-on-surface appearance-none focus:ring-2 focus:ring-primary/40 outline-none">
                <option>Internal</option>
                <option>External</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4 md:w-4.5 md:h-4.5" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Department</label>
            <div className="relative">
              <select 
                className="w-full bg-white/60 backdrop-blur-sm border-none rounded-xl p-3.5 md:p-4 text-sm md:text-base text-on-surface appearance-none focus:ring-2 focus:ring-primary/40 outline-none"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option>ASSIST</option>
                <option>Fundație</option>
                <option>Sports Club</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4 md:w-4.5 md:h-4.5" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 md:gap-2">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Team Members</label>
          <div className="relative">
            <div className="w-full bg-white/60 backdrop-blur-sm rounded-xl p-2 min-h-[52px] md:min-h-[56px] flex flex-wrap gap-2 items-center">
              {selectedCollaborators.map(collab => (
                <span key={collab.id} className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1">
                  {collab.name}
                  <button 
                    className="p-0.5 hover:bg-black/5 rounded-full" 
                    type="button"
                    onClick={() => toggleCollaborator(collab)}
                  >
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
                  onChange={(e) => {
                    setMemberSearch(e.target.value);
                    setShowMemberDropdown(true);
                  }}
                  onFocus={() => setShowMemberDropdown(true)}
                />
                {showMemberDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/20 z-[100] max-h-[200px] overflow-y-auto botanical-shadow">
                    <div className="p-2 space-y-1">
                      {/* User said no one should be there if not in a team */}
                      <div className="p-4 text-center text-xs text-on-surface-variant">No members found (Join a team first)</div>
                    </div>
                  </div>
                )}
              </div>
              <UserPlus className="text-on-surface-variant px-2 w-9 h-5 md:w-10 md:h-6" />
            </div>
            {showMemberDropdown && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMemberDropdown(false)}
              />
            )}
          </div>
        </div>

          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-container w-4 h-4 md:w-4.5 md:h-4.5" />
              <input 
                className="w-full bg-white/60 backdrop-blur-sm border-none rounded-xl p-3.5 md:p-4 pl-11 md:pl-12 text-sm md:text-base text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 outline-none" 
                placeholder="Meeting Room Alpha or Virtual Link" 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

        <div className="pt-2 md:pt-6 space-y-3 md:space-y-4">
          <button 
            className="w-full h-12 md:h-14 bg-gradient-to-br from-primary to-primary-container text-white text-sm md:text-base font-bold rounded-xl shadow-[0_8px_16px_rgba(3,86,232,0.25)]" 
            type="submit"
          >
            {initialEvent ? 'Save Changes' : 'Create Event'}
          </button>
          
          {initialEvent && onDelete && (
            <button 
              type="button"
              onClick={onDelete}
              className="w-full h-12 md:h-14 bg-white/40 backdrop-blur-sm text-red-500 text-sm md:text-base font-bold rounded-xl border border-red-100 hover:bg-red-50/50 transition-none"
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
