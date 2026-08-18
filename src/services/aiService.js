import api from './api';

const aiService = {
  sendMessage: async (message, context = {}) => {
    try {
      const response = await api.post('/ai/chat/', { message, context });
      return response.data;
    } catch {
      // Offline Simulation Fallback
      return new Promise((resolve) => {
        setTimeout(() => {
          let responseText = "I can assist you with your MACFAST campus schedules, study tracks, and event registrations. Let me know what you need!";
          
          const lowerMessage = message.toLowerCase();
          if (lowerMessage.includes("notice") || lowerMessage.includes("summarize")) {
            responseText = "📝 **Notice Summary:** The technical symposium registrations close this Friday at 5:00 PM. No late entries will be accepted.";
          } else if (lowerMessage.includes("grammar") || lowerMessage.includes("fix")) {
            responseText = "✨ **Revised Draft:** 'I am looking forward to participating in the campus-wide hackathon this weekend.'";
          } else if (lowerMessage.includes("hackathon") || lowerMessage.includes("event")) {
            responseText = "📅 **Upcoming Events:** We have the 'MACFAST National Hackathon 2026' scheduled for October 15th, and an 'Intro to Generative AI Systems' workshop on August 22nd.";
          }

          resolve({ response: responseText });
        }, 800); // Mimic 800ms network processing delay
      });
    }
  }
};

export default aiService;