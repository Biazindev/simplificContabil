// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Credentials from './Credentials';
import DashboardPizzaria from "./pages/dashboardpizzaria/DashboardPizzaria";
import CriarPedido from "./pages/dashboardpizzaria/pedido/novo/CriarPedido";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Credentials />} />
        <Route path="/dashboard" element={<DashboardPizzaria />} />
        <Route path="/dashboard/pizzaria/pedidos/novo" element={<CriarPedido />} />
      </Routes>
    </Router>
  );
}

export default App;