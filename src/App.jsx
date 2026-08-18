import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import EventsPage from './pages/events/EventsPage';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import AIAssistantWidget from './components/AIAssistantWidget';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

/**
 * Route Guard Component
 * Wraps protected pages, checks for the auth token, and injects the global navigation.
 */
const ProtectedLayout = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('user');

  if (!isAuthenticated) {
    // Kick unauthorized users back to login
    return <Navigate to="/login" replace />;
  }

  return (
    
    <div className="min-h-screen relative pb-24 md:pb-6 bg-slate-50 dark:bg-slate-950">
      {/* These only render for authenticated sessions */}
      <Navbar /> 
      
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {children}
      </main>
      
      <AIAssistantWidget />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<AuthPage />} />

      {/* Protected Routes */}
      <Route 
        path="/home" 
        element={
          <ProtectedLayout>
            <HomePage />
          </ProtectedLayout>
        } 
      />
      
      <Route 
        path="/events" 
        element={
          <ProtectedLayout>
            <EventsPage />
          </ProtectedLayout>
        } 
      />
      
      <Route 
        path="/analytics" 
        element={
          <ProtectedLayout>
            <AnalyticsDashboard />
          </ProtectedLayout>
        } 
      />
      <Route 
  path="/profile" 
  element={
    <ProtectedLayout>
      <ProfilePage />
    </ProtectedLayout>
  } 
/>

      {/* Wildcard Fallbacks */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;