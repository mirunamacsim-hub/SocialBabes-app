import { useState } from 'react';
import { Layout } from './components/Layout';
import { ScheduleView } from './components/ScheduleView';
import { EventDetailView } from './components/EventDetailView';
import { CreateEventView } from './components/CreateEventView';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';
import { INITIAL_EVENTS } from './constants';
import { Event, View } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('socialbabes_auth') === 'true';
  });
  const [currentView, setCurrentView] = useState<View>('schedule');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events] = useState<Event[]>([]);

  const handleLogin = (stayLoggedIn: boolean) => {
    setIsAuthenticated(true);
    if (stayLoggedIn) {
      localStorage.setItem('socialbabes_auth', 'true');
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('detail');
  };

  const handleCreateClick = () => {
    setCurrentView('create');
  };

  const handleBack = () => {
    if (currentView === 'detail' || currentView === 'create') {
      setCurrentView('schedule');
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
            onEdit={() => {}} 
            onDelete={() => setCurrentView('schedule')} 
          />
        ) : null;
      case 'create':
        return (
          <CreateEventView 
            onCancel={() => setCurrentView('schedule')} 
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentView('schedule');
            }} 
          />
        );
      case 'profile':
        return <ProfileView />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'schedule': return 'SocialBabes';
      case 'detail': return 'Event Details';
      case 'create': return '';
      case 'profile': return 'Profile';
      default: return 'SocialBabes';
    }
  };

  return (
    <Layout
      currentView={currentView}
      onViewChange={setCurrentView}
      title={getTitle()}
      showBack={currentView === 'detail' || currentView === 'create'}
      onBack={handleBack}
    >
      {renderContent()}
    </Layout>
  );
}
