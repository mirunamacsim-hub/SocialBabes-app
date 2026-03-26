import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Flower2, User } from 'lucide-react';

interface AuthViewProps {
  onLogin: (stayLoggedIn: boolean, name: string) => void;
  profilePic: string;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, profilePic }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = isLogin
      ? localStorage.getItem('socialbabes_name') || 'User'
      : `${firstName} ${lastName}`.trim();
    onLogin(stayLoggedIn, name);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FDFCFB] via-[#F5F5F0] to-[#E8EAE3] flex flex-col items-center justify-center p-4 md:p-6 transition-none">
      <div className="flex flex-col items-center mb-8 md:mb-10 transition-none">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FCE4EC] rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-sm transition-none">
          <Flower2 className="w-8 h-8 md:w-10 md:h-10 text-[#7A002B] transition-none" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1C1C19] tracking-tight mb-1 transition-none">
          SocialBabes
        </h1>
      </div>

      <div className="w-full max-w-[440px] bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/40 transition-none">
        <div className="mb-8 md:mb-10 transition-none">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C19] mb-2 transition-none">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm md:text-base text-[#1C1C19]/70 leading-relaxed transition-none">
            {isLogin
              ? 'Sign in to explore the garden of events.'
              : 'Join our community of marketing girlies.'}
          </p>
        </div>

        <form className="space-y-6 md:space-y-8 transition-none" onSubmit={handleSubmit}>

          {/* First & Last Name — Sign Up only */}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#1C1C19]/50 ml-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C19]/30">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Miruna"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#EAE9E5]/50 border-none rounded-xl py-4 pl-10 pr-3 text-sm text-[#1C1C19] placeholder:text-[#1C1C19]/30 outline-none focus:ring-2 focus:ring-[#7A002B]/20 transition-none"
                    required={!isLogin}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#1C1C19]/50 ml-1">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Macsim"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#EAE9E5]/50 border-none rounded-xl py-4 px-3 text-sm text-[#1C1C19] placeholder:text-[#1C1C19]/30 outline-none focus:ring-2 focus:ring-[#7A002B]/20 transition-none"
                    required={!isLogin}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#1C1C19]/50 ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C19]/30">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="hello@socialbabes.com"
                className="w-full bg-[#EAE9E5]/50 border-none rounded-xl py-4 md:py-5 pl-12 pr-4 text-sm md:text-base text-[#1C1C19] placeholder:text-[#1C1C19]/30 outline-none focus:ring-2 focus:ring-[#7A002B]/20 transition-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#1C1C19]/50">
                Password
              </label>
              {isLogin && (
                <button type="button" className="text-[10px] md:text-[11px] font-bold text-[#7A002B] hover:underline transition-none">
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C19]/30">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-[#EAE9E5]/50 border-none rounded-xl py-4 md:py-5 pl-12 pr-12 text-sm md:text-base text-[#1C1C19] placeholder:text-[#1C1C19]/30 outline-none focus:ring-2 focus:ring-[#7A002B]/20 transition-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1C1C19]/40 hover:text-[#1C1C19] transition-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Stay Logged In */}
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              id="stayLoggedIn"
              checked={stayLoggedIn}
              onChange={(e) => setStayLoggedIn(e.target.checked)}
              className="w-4 h-4 rounded border-[#1C1C19]/20 text-[#7A002B] focus:ring-[#7A002B]/20 transition-none"
            />
            <label htmlFor="stayLoggedIn" className="text-xs md:text-sm text-[#1C1C19]/60 font-medium cursor-pointer transition-none">
              Stay logged in
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#7A002B] text-white py-4 md:py-5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(122,0,43,0.25)] hover:bg-[#5A0020] transition-none text-sm md:text-base"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </form>

        <div className="mt-8 md:mt-10 text-center">
          <p className="text-sm md:text-base text-[#1C1C19]/60">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-[#7A002B] hover:underline transition-none"
            >
              {isLogin ? 'Sign Up instead' : 'Sign In instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
