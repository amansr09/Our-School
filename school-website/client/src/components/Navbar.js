import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FaBars, FaTimes, FaEdit } from 'react-icons/fa';
import { getContent, updateContent } from '../utils/api';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const token = localStorage.getItem('token');
  const isEditMode = searchParams.get('editMode') === 'true' && token;
  
  const [schoolName, setSchoolName] = useState('School Name');
  const [schoolNameId, setSchoolNameId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    fetchSchoolName();
  }, []);

  const fetchSchoolName = async () => {
    try {
      const res = await getContent('school-name');
      if (res.data && res.data.length > 0) {
        setSchoolName(res.data[0].title || 'School Name');
        setSchoolNameId(res.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching school name:', error);
    }
  };

  const handleEditSchoolName = () => {
    setEditedName(schoolName);
    setShowEditModal(true);
  };

  const handleSaveSchoolName = async () => {
    try {
      if (schoolNameId) {
        await updateContent(schoolNameId, { title: editedName });
        setSchoolName(editedName);
        setShowEditModal(false);
        toast.success('School name updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update school name');
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  if (isAdmin && location.pathname !== '/admin/login') {
    return (
      <nav className="navbar admin-navbar">
        <div className="container">
          <div className="nav-content">
            <Link to="/admin" className="logo">Admin Panel</Link>
            <div className="admin-nav-links">
              <Link to="/">View Website</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo-wrapper">
              <a href="#home" className="logo">{schoolName}</a>
              {isEditMode && (
                <button className="edit-school-name-btn" onClick={handleEditSchoolName}>
                  <FaEdit />
                </button>
              )}
            </div>
            
            <div className={`nav-links ${isOpen ? 'active' : ''}`}>
              <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
              <a href="#about" onClick={() => setIsOpen(false)}>About</a>
              <a href="#programs" onClick={() => setIsOpen(false)}>Programs</a>
              <a href="#gallery" onClick={() => setIsOpen(false)}>Gallery</a>
              <a href="#faculty" onClick={() => setIsOpen(false)}>Faculty</a>
              <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
              {token && <Link to="/admin" onClick={() => setIsOpen(false)}>Admin</Link>}
            </div>

            <div className="mobile-menu-icon" onClick={toggleMenu}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>
      </nav>

      {/* Edit School Name Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit School Name</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>School Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter school name"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSaveSchoolName} className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
