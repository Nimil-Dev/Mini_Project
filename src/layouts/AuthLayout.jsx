import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-gray-900">
      
      {/* Decorative Floating Ambient Orbs */}
      <motion.div 
        animate={{ 
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"
      />
      <motion.div 
        animate={{ 
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
      />

      {/* Auth Canvas Container */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;