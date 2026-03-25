import React, { useState, useRef } from 'react';
import { UserPlus, Users, Bell, Lock, ChevronRight, Edit2 } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string>("https://lh3.googleusercontent.com/aida-public/AB6AXuD9tNK-bLCKNY08gJVgH80Jv7G12RU9K1e6gwcXw4EhNtl3k3Th7UWIoEdttNfYOI30sGviWxw3zG_CxvoMLQwh5rmUgRv_x5ryJaSQQc9ZDwZI8atFrBFjveQGGfAAAR0ZIdpcp1R6ZM02KD5sePf7uPc3dZo8-_kinSGssSnhYfJi6uAnS5NqQ1EP7oSsqQ8h7FIVRKyLftYc3PcxhHtbEoz0_Bapz4U5NKOy7_zMwDF0mxzVPKiHPiHp8sEztPx2itXTVOMK_RM");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="pb-32">
      <section className="relative mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 md:items-end">
          <div className="relative group">
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden botanical-shadow ring-4 ring-white/50 bg-surface-container">
              <img 
                alt="User Profile" 
                className="w-full h-full object-cover" 
                src={profilePic}
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={triggerFileInput}
              className="absolute bottom-0.5 right-0.5 md:bottom-1 md:right-1 bg-primary text-white p-1.5 md:p-2 rounded-full shadow-lg hover:opacity-90 transition-none"
            >
              <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Miruna Macsim</h2>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl botanical-shadow flex flex-col gap-5 md:gap-6 border border-white/20">
          <div className="space-y-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary-container flex items-center justify-center rounded-lg">
              <UserPlus className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-on-surface">Create a Team</h3>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">Establish a new workspace and invite collaborators.</p>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Team Name</label>
              <input className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm md:text-base text-on-surface focus:ring-2 focus:ring-primary/40 placeholder:text-on-surface-variant/50 outline-none" placeholder="e.g. Evergreen Studio" type="text" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Set Password</label>
              <input className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm md:text-base text-on-surface focus:ring-2 focus:ring-primary/40 outline-none" placeholder="••••••••" type="password" />
            </div>
          </div>
          <button className="bg-gradient-to-br from-primary to-primary-container text-white text-sm md:text-base font-bold py-3.5 md:py-4 rounded-lg w-full shadow-md hover:opacity-90 transition-none">
            Initialize Team
          </button>
        </div>

        <div className="bg-white/60 backdrop-blur-sm p-6 md:p-8 rounded-xl flex flex-col gap-5 md:gap-6 border border-white/20">
          <div className="space-y-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-container-highest/50 flex items-center justify-center rounded-lg">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-on-surface">Join a Team</h3>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">Enter an existing team's secure access key to start collaborating immediately.</p>
          </div>
          <div className="flex-grow flex flex-col justify-end gap-3 md:gap-4 mt-4 md:mt-0">
            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Access Password</label>
              <input className="w-full bg-white/80 border-none rounded-lg p-3 text-sm md:text-base text-on-surface focus:ring-2 focus:ring-primary/40 outline-none" placeholder="Enter secure key" type="password" />
            </div>
            <button className="bg-gradient-to-br from-primary to-primary-container text-white text-sm md:text-base font-bold py-3.5 md:py-4 rounded-lg w-full shadow-md hover:opacity-90 transition-none">
              Verify & Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
