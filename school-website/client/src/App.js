import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import Home from './pages/Home';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageContent from './pages/admin/ManageContent';
import ManageGallery from './pages/admin/ManageGallery';
import ManageEvents from './pages/admin/ManageEvents';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ViewContacts from './pages/admin/ViewContacts';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public Routes - Single Page */}
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/content" element={<PrivateRoute><ManageContent /></PrivateRoute>} />
          <Route path="/admin/gallery" element={<PrivateRoute><ManageGallery /></PrivateRoute>} />
          <Route path="/admin/events" element={<PrivateRoute><ManageEvents /></PrivateRoute>} />
          <Route path="/admin/faculty" element={<PrivateRoute><ManageFaculty /></PrivateRoute>} />
          <Route path="/admin/announcements" element={<PrivateRoute><ManageAnnouncements /></PrivateRoute>} />
          <Route path="/admin/contacts" element={<PrivateRoute><ViewContacts /></PrivateRoute>} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
