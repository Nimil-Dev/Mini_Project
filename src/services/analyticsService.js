// Dummy wrapper for network data. Replace with your axial/fetch client as needed.
import api from './api';

const analyticsService = {
  // Fetches core counters (e.g., total logins, completion rate, hours spent)
  getOverviewMetrics: async (role = 'student') => {
    try {
      const response = await api.get(`/analytics/overview/?role=${role}`);
      return response.data;
    } catch {
      // Fallback structured data for prototyping
      return {
        cards: [
          { label: 'Weekly Study Hours', value: '34.5 hrs', change: '+12%', isPositive: true },
          { label: 'Resource Downloads', value: '148', change: '+8%', isPositive: true },
          { label: 'Event Registrations', value: '6', change: '-1', isPositive: false },
          { label: 'Platform Engagement', value: '92%', change: '+3%', isPositive: true }
        ]
      };
    }
  },

  // Fetches historical trend data for charts
  getTrendData: async (timeframe = 'weekly') => {
    try {
      const response = await api.get(`/analytics/trends/?timeframe=${timeframe}`);
      return response.data;
    } catch {
      return {
        timelineLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        activityDataset: [65, 78, 52, 85, 90, 45, 30],
        categoryDistribution: {
          labels: ['Technical', 'Sports', 'Arts', 'Workshops'],
          data: [40, 25, 15, 20]
        }
      };
    }
  }
};

export default analyticsService;