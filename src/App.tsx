import React from 'react';
import { AppSettingsProvider } from './store/appSettings';

import './App.css';
import Dashboard from './components/dashboard';

function App() {
  return (
    <AppSettingsProvider>
      <Dashboard />
    </AppSettingsProvider>
  );
}

export default App;
