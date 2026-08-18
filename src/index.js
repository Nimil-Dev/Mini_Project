import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Uses 'contexts' with an 's' which we fixed earlier
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error("Failed to find the root element. Make sure public/index.html has <div id='root'></div>");
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);