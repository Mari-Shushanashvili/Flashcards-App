import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found. Make sure your HTML has <div id='root'></div>");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
