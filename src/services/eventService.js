import api from './api';

const eventService = {
  getEvents: async (category = '', archive = false) => {
    const response = await api.get(`/events/?category=${category}&archive=${archive}`);
    return response.data;
  },

  registerEvent: async (eventId) => {
    const response = await api.post(`/events/${eventId}/register/`);
    return response.data;
  },

  getParticipants: async (eventId) => {
    const response = await api.get(`/events/${eventId}/participants/`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events/', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default eventService;