import React, { useState, useRef } from 'react';
import { Calendar, Clock, MapPin, ChevronDown, UserPlus, X, Sparkles, Upload, Loader2 } from 'lucide-react';
import { COLLABORATORS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface CreateEventViewProps {
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreateEventView: React.FC<CreateEventViewProps> = ({
  onCancel,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">Add new event</h2>
      </div>
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-6 md:gap-8 pb-32">

        <div className="flex flex-col gap-1.5 md:gap-2">
          <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Event Name</label>
          <input 
            className="w-full bg-white/60 backdrop-blur-sm border-none rounded-xl p-3.5 md:p-4 text-sm md:text-base text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/40 outline-none" 
            placeholder="e.g. Quarterly Strategic Alignment" 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
                <input className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-outline-variant text-primary-container focus:ring-primary/40" type="checkbox" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">TBD</span>
              </label>
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-container w-4 h-4 md:w-4.5 md:h-4.5" />
              <input 
                className="w-full bg-white/60 backdrop-blur-sm border-none rounded-xl p-3.5 md:p-4 pl-11 md:pl-12 text-sm md:text-base text-on-surface focus:ring-2 focus:ring-primary/40 outline-none" 
                type="date"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 md:gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Time</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-outline-variant text-primary-container focus:ring-primary/40" type="checkbox" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">TBD</span>
              </label>
            </div>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-container w-4 h-4 md:w-4.5 md:h-4.5" />
              <select className="w-full bg-white/60 backdrop-blur-sm border-none rounded-xl p-3.5 md:p-4 pl-11 md:pl-12 text-sm md:text-base text-on-surface appearance-none focus:ring-2 focus:ring-primary/40 outline-none">
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
              <select className="w-full bg-white/60 backdrop-blur-sm border-none rounded-xl p-3.5 md:p-4 text-sm md:text-base text-on-surface appearance-none focus:ring-2 focus:ring-primary/40 outline-none">
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
              <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1">
                Elena Vance
                <button className="p-0.5 hover:bg-black/5 rounded-full" type="button">
                  <X className="w-3 h-3" />
                </button>
              </span>
              <input className="bg-transparent border-none focus:ring-0 p-1.5 md:p-2 text-sm flex-grow outline-none" placeholder="Add members..." type="text" />
              <UserPlus className="text-on-surface-variant px-2 w-9 h-5 md:w-10 md:h-6" />
            </div>
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
              />
            </div>
          </div>

        <div className="pt-2 md:pt-6 space-y-3 md:space-y-4">
          <button 
            className="w-full h-12 md:h-14 bg-gradient-to-br from-primary to-primary-container text-white text-sm md:text-base font-bold rounded-xl shadow-[0_8px_16px_rgba(3,86,232,0.25)]" 
            type="submit"
          >
            Create Event
          </button>
          <button 
            onClick={onCancel}
            className="w-full h-12 md:h-14 text-on-surface-variant text-sm md:text-base font-bold hover:bg-black/5 rounded-xl" 
            type="button"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
};
