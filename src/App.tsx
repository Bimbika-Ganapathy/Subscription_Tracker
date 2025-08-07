import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddTracker from './components/AddTracker';
import TrackersOverview from './components/TrackersOverview';
import ReminderCenter from './components/ReminderCenter';
import Settings from './components/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation Bar */}
        <Navigation isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Content Area */}
        <div className="flex-grow flex items-center justify-center px-4 lg:ml-64">
          <div className="w-full max-w-5xl">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/add-tracker" element={<ProtectedRoute><AddTracker /></ProtectedRoute>} />
              <Route path="/trackers" element={<ProtectedRoute><TrackersOverview /></ProtectedRoute>} />
              <Route path="/reminders" element={<ProtectedRoute><ReminderCenter /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
