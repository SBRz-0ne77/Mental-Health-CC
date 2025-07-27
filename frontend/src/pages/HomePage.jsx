import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Mental Health Counseling Center</h1>
        <p className="mb-6 text-center">Welcome! Please select your role to continue:</p>
        <div className="flex flex-col gap-4">
          <Link to="/admin" className="w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Admin</Link>
          <Link to="/doctor" className="w-full text-center bg-green-600 text-white py-2 rounded hover:bg-green-700">Doctor</Link>
          <Link to="/appointments" className="w-full text-center bg-purple-600 text-white py-2 rounded hover:bg-purple-700">Appointments</Link>
          <Link to="/payments" className="w-full text-center bg-pink-600 text-white py-2 rounded hover:bg-pink-700">Payments</Link>
        </div>
      </div>
    </div>
  );
} 