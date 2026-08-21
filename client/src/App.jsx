import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MapFinder } from './pages/MapFinder';
import { AdminGraveList } from './pages/AdminGraveList';
import { GraveForm } from './pages/GraveForm';
import { Donation } from './pages/Donation';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MapFinder />} />
          <Route path="/maps" element={<Navigate to="/" replace />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/graves"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminGraveList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/graves/create"
            element={
              <ProtectedRoute requireAdmin={true}>
                <GraveForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/graves/:id/edit"
            element={
              <ProtectedRoute requireAdmin={true}>
                <GraveForm />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};
