import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "College email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    try {
      const user = await login(email, password);
      
      // Role-based routing upon successful authentication
      if (user.role === 'STUDENT') {
        navigate('/dashboard/student');
      } else {
        navigate('/feed');
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8"
    >
      {/* Brand Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-wide">MACFAST</h2>
        <p className="text-blue-200/80 text-sm mt-1 font-medium tracking-wider">CAMPUSCONNECT</p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-3 mb-5 bg-red-500/20 border border-red-500/40 text-red-200 text-sm rounded-xl"
        >
          <FiAlertCircle className="shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">College Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${validationErrors.email ? 'border-red-400' : 'border-white/10'} focus:border-blue-400 rounded-xl outline-none text-white transition placeholder-gray-500`}
              placeholder="you@macfast.org"
            />
          </div>
          {validationErrors.email && (
            <p className="text-xs text-red-400 mt-1">{validationErrors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-200">Password</label>
            <Link to="/auth/forgot-password" className="text-xs text-blue-400 hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${validationErrors.password ? 'border-red-400' : 'border-white/10'} focus:border-blue-400 rounded-xl outline-none text-white transition placeholder-gray-500`}
              placeholder="••••••••"
            />
          </div>
          {validationErrors.password && (
            <p className="text-xs text-red-400 mt-1">{validationErrors.password}</p>
          )}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition duration-150"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </motion.button>
      </form>

      {/* Redirection Footer */}
      <div className="mt-8 text-center text-sm text-gray-300">
        New to the platform?{' '}
        <Link to="/auth/register" className="text-blue-400 hover:underline font-medium">
          Create an account
        </Link>
      </div>
    </motion.div>
  );
};

export default Login;