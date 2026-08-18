import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiPlus, FiAlertTriangle } from 'react-icons/fi';
import eventService from '../../services/eventService';
import EventCard from '../../components/cards/EventCard';
import { useAuth } from '../../hooks/useAuth';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['All', 'Technical', 'Sports', 'Arts', 'Workshop', 'Seminar', 'Hackathon'];

  useEffect(() => {
    loadEvents();
  }, [selectedCategory]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const activeFilter = selectedCategory === 'All' ? '' : selectedCategory;
      const data = await eventService.getEvents(activeFilter);
      setEvents(data);
    } catch (err) {
      setError('Could not retrieve campus events. Please verify network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterToggle = async (eventId) => {
    try {
      const response = await eventService.registerEvent(eventId);
      
      // Update event state locally
      setEvents(prevEvents =>
        prevEvents.map(event => {
          if (event.id === eventId) {
            let updatedParticipants = [...(event.participants || [])];
            if (response.registered) {
              updatedParticipants.push({ id: user.id, full_name: user.full_name });
            } else {
              updatedParticipants = updatedParticipants.filter(p => p.id !== user.id);
            }
            return {
              ...event,
              is_registered: response.registered,
              participants_count: response.participant_count,
              participants: updatedParticipants
            };
          }
          return event;
        })
      );
    } catch (err) {
      alert('Event registration failed. Please refresh and try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Canvas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiCalendar className="text-blue-500" />
            <span>MACFAST Campus Events</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse and register for workshops, competitions, and department events.
          </p>
        </div>

        {/* Dynamic Creation Button (Teachers/Coordinators/Admins Only) */}
        {['ADMIN', 'TEACHER', 'DEPT', 'CLUB'].includes(user?.role) && (
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-500/10">
            <FiPlus />
            <span>Create Event</span>
          </button>
        )}
      </div>

      {/* Filter Tabs Row */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border
              ${(cat === 'All' && selectedCategory === '') || selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Event Grid Display */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white/40 dark:bg-slate-900/40 border border-slate-200/10 h-96 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 flex flex-col items-center gap-2">
          <FiAlertTriangle className="w-8 h-8" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegisterToggle={handleRegisterToggle}
              />
            ))}
          </div>
          {events.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm">
              No events match your selected category. Check back soon!
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventsPage;