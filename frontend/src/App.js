import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import DoctorPage from "./pages/DoctorPage";
import AppointmentPage from "./pages/AppointmentPage";
import PaymentPage from "./pages/PaymentPage";
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/payments" element={<PaymentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
