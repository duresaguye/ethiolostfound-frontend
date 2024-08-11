import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the new `createRoot` import
import './index.css';
import App from './App';
import { AuthProvider } from './components/AuthContext';
import { ItemsProvider } from './components/ItemsContext';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ItemsProvider>
        <App />
      </ItemsProvider>
    </AuthProvider>
  </React.StrictMode>
);
