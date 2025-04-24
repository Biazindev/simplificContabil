// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Credentials from './Credentials';
import DashboardPizzaria from "./pages/dashboardpizzaria/DashboardPizzaria";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Credentials />} />
        <Route path="/dashboard" element={<DashboardPizzaria />} />
      </Routes>
    </Router>
  );
}

export default App;