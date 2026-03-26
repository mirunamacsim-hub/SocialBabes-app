import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout } from './components/Layout';
import { ScheduleView } from './components/ScheduleView';
import { EventDetailView } from './components/EventDetailView';
import { CreateEventView } from './components/CreateEventView';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';
import { INITIAL_EVENTS, PPG_IMAGES } from './constants';
import { Event, View } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('socialbabes_auth') === 'true';
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('socialbabes_name') || '';
  });
  const [currentView, setCurrentView] = useState<View>('schedule');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState<string>(() => {
    const saved = localStorage.getItem('socialbabes_profile_pic');
    if (saved) return saved;
    const randomPic = PPG_IMAGES[Math.floor(Math.random() * PPG_IMAGES.length)];
    localStorage.setItem('socialbabes_profile_pic', randomPic);
    return randomPic;
  });

  const handleUpdateProfilePic = (newPic: string) => {
    setProfilePic(newPic);
    localStorage.setItem('socialbabes_profile_pic', newPic);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('socialbabes_auth');
    setIsAuthenticated(false);
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

const handleLogin = (stayLoggedIn: boolean, name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    localStorage.setItem('socialbabes_name', name);
    if (stayLoggedIn) {
      localStorage.setItem('socialbabes_auth', 'true');
    }
  };

  const handleAddEvent = (event: Event) => {
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
      setEditingEvent(null);
    } else {
      setEvents(prev => [...prev, event]);
    }
    setCurrentView('schedule');
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      setEvents(prev => prev.filter(e => e.id !== editingEvent.id));
      setEditingEvent(null);
      setShowDeleteConfirm(false);
      setCurrentView('schedule');
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('detail');
  };

  const handleCreateClick = () => {
    setEditingEvent(null);
    setCurrentView('create');
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setCurrentView('create');
  };

  const handleBack = () => {
    if (currentView === 'detail' || currentView === 'create') {
      setCurrentView('schedule');
      setEditingEvent(null);
    }
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'schedule':
        return (
          <ScheduleView 
            events={events} 
            onEventClick={handleEventClick} 
            onCreateClick={handleCreateClick} 
          />
        );
      case 'detail':
        return selectedEvent ? (
          <EventDetailView 
            event={selectedEvent} 
            onEdit={() => handleEditClick(selectedEvent)} 
            onDelete={() => {
              setEditingEvent(selectedEvent);
              setShowDeleteConfirm(true);
            }} 
          />
        ) : null;
      case 'create':
        return (
          <CreateEventView 
            onCancel={() => {
              if (editingEvent) {
                setCurrentView('detail');
              } else {
                setCurrentView('schedule');
              }
              setEditingEvent(null);
            }} 
            onSubmit={handleAddEvent}
            initialEvent={editingEvent || undefined}
            onDelete={() => setShowDeleteConfirm(true)}
          />
        );
case 'profile':
        return <ProfileView profilePic={profilePic} onUpdateProfilePic={handleUpdateProfilePic} userName={userName} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'schedule': return 'SocialBabes';
      case 'detail': return 'Event Details';
      case 'create': return editingEvent ? 'Edit Event' : '';
      case 'profile': return 'SocialBabes';
      default: return 'SocialBabes';
    }
  };

  return (
    <>
      <Layout
        currentView={currentView}
        onViewChange={setCurrentView}
        title={getTitle()}
        showBack={currentView === 'detail' || currentView === 'create'}
        onBack={handleBack}
        profilePic={profilePic}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      >
        {renderContent()}
      </Layout>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/50 shadow-2xl w-full max-w-sm text-center"
            >
              <h3 className="text-xl font-bold text-primary mb-2">Delete Event?</h3>
              <p className="text-sm text-on-surface-variant mb-8">Are you sure you want to delete this event? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-none"
                >
                  No, Keep it
                </button>
                <button 
                  onClick={handleDeleteEvent}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-500/20 transition-none"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
