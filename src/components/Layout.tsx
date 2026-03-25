import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, User, ArrowLeft, Menu, X, Flower2 } from 'lucide-react';
import { View } from '../types';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onViewChange,
  title,
  showBack,
  onBack
}) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="bg-custom-pattern" />
      <div className="flower-overlay" />
      
      <header className="flex justify-between items-center w-full px-4 md:px-6 h-14 bg-white/40 glass-header sticky top-0 z-50 border-b border-outline-variant/5">
        <div className="flex items-center gap-3 md:gap-4">
          {showBack && (
            <button 
              onClick={onBack}
              className="p-1.5 md:p-2 hover:bg-black/5 rounded-full transition-none"
            >
              {currentView === 'create' ? (
                <X className="w-5 h-5 text-on-surface-variant" />
              ) : (
                <ArrowLeft className="w-5 h-5 text-primary-container" />
              )}
            </button>
          )}
          <div className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-primary transition-none" />
            <h1 className="text-lg font-extrabold text-primary-container tracking-tight">
              {title}
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow px-4 md:px-6 pt-4 md:pt-8 pb-32 max-w-4xl mx-auto w-full relative z-10">
        {children}
      </main>

      {currentView !== 'detail' && currentView !== 'create' && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-48 z-50 flex justify-around items-center px-1 py-1 bg-background/20 backdrop-blur-md shadow-[0_4px_20px_rgba(28,28,25,0.05)] rounded-full border border-white/20">
          <div className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-secondary-container/60 rounded-full transition-none" 
               style={{ transform: `translateX(${currentView === 'profile' ? '100%' : '0%'})` }} />
          
          <button
            onClick={() => onViewChange('schedule')}
            className={cn(
              "relative z-10 flex flex-col items-center justify-center rounded-full w-full py-2.5 transition-none",
              currentView === 'schedule' ? "text-primary" : "text-on-surface-variant hover:text-primary"
            )}
          >
            <CalendarIcon className={cn("w-6 h-6 transition-none", currentView === 'schedule' && "fill-current")} />
          </button>

          <button
            onClick={() => onViewChange('profile')}
            className={cn(
              "relative z-10 flex flex-col items-center justify-center rounded-full w-full py-2.5 transition-none",
              currentView === 'profile' ? "text-primary" : "text-on-surface-variant hover:text-primary"
            )}
          >
            <User className={cn("w-6 h-6 transition-none", currentView === 'profile' && "fill-current")} />
          </button>
        </nav>
      )}
    </div>
  );
};
