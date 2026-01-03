import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // This assumes your main logic is in App.tsx
import './index.css';    // Optional: if you have a global CSS file

// The ID 'root' must match the <div id="root"> in your index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
