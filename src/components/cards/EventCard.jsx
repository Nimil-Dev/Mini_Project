import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, FiClock, FiMapPin, FiUser, FiUsers, FiCheckCircle 
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const EventCard = ({ event, onRegisterToggle }) => {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [showParticipants, setShowParticipants] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Helper to calculate exact time difference
  function calculateTimeLeft() {
    const difference = +new Date(`${event.date}T${event.time}`) - +new Date();
    let timeLeftObj = {};

    if (difference > 0) {
      timeLeftObj = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      timeLeftObj = null; // Event has already started or completed
    }
    return timeLeftObj;
  }

  // Active effect interval for live ticking countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [event.date, event.time]);

  const handleRegistration = async () => {
    if (isRegistering) return;
    setIsRegistering(true);
    await onRegisterToggle(event.id);
    setIsRegistering(false);
  };

  const getCategoryColor = (category) => {
    const styles = {
      Technical: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400',
      Sports: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
      Arts: 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400',
      Workshop: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400',
      Seminar: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400',
      Hackathon: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400',
    };
    return styles[category] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full"
    >
      {/* Event Banner Poster */}
      <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-850 overflow-hidden">
        <img 
          src={event.poster_url || '/placeholder-event.png'} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
        </div>
      </div>

      {/* Content Canvas */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Organised By Meta */}
          <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">
            <span>By {event.organizer}</span>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-1 mb-2">
            {event.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
            {event.description}
          </p>

          {/* Practical Metadata Attributes */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-slate-500 dark:text-slate-400 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-blue-500" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 text-blue-500" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <FiMapPin className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        <div>
          {/* Live Dynamic Countdown Timer Block */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-3 mb-4">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
              Time Remaining
            </div>
            {timeLeft ? (
              <div className="flex gap-2 text-center">
                {[
                  { value: timeLeft.days, label: 'd' },
                  { value: timeLeft.hours, label: 'h' },
                  { value: timeLeft.minutes, label: 'm' },
                  { value: timeLeft.seconds, label: 's' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-baseline gap-0.5">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                Event Closed / In Progress
              </span>
            )}
          </div>

          {/* Registration Tracking Action Row */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="flex items-center gap-1 text-slate-500 hover:text-blue-500 text-xs font-semibold"
            >
              <FiUsers className="w-4 h-4" />
              <span>{event.participants_count} Registered</span>
            </button>

            <button
              onClick={handleRegistration}
              disabled={isRegistering || !timeLeft}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm
                ${event.is_registered 
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/10'
                }
                disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:border-none
              `}
            >
              {event.is_registered ? (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Registered</span>
                </>
              ) : (
                <span>{isRegistering ? 'Processing...' : 'Register'}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Participant Panel */}
      <AnimatePresence>
        {showParticipants && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 overflow-hidden"
          >
            <div className="p-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Participant List</h4>
              {event.participants && event.participants.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {event.participants.map((person) => (
                    <div key={person.id} className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 px-2 py-1 rounded-lg text-[10px]">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[8px]">
                        {person.full_name.charAt(0)}
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{person.full_name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-400">Be the first to secure a slot!</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventCard;