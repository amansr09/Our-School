import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { getContent, updateContent } from '../utils/api';
import { toast } from 'react-toastify';
import './Footer.css';

const Footer = () => {
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('editMode') === 'true' && localStorage.getItem('token');
  const [footerText, setFooterText] = useState('© 2025 All rights reserved');
  const [footerId, setFooterId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchFooterText();
  }, []);

  const fetchFooterText = async () => {
    try {
      const res = await getContent('footer');
      if (res.data && res.data.length > 0) {
        setFooterText(res.data[0].title || '© 2025 All rights reserved');
        setFooterId(res.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching footer text:', error);
    }
  };

  const handleEdit = () => {
    setEditText(footerText);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      if (footerId) {
        const formData = new FormData();
        formData.append('title', editText);
        formData.append('section', 'footer');
        
        await updateContent(footerId, formData);
        setFooterText(editText);
        setShowEditModal(false);
        toast.success('Footer updated successfully');
        fetchFooterText(); // Refresh to get the latest data
      }
    } catch (error) {
      console.error('Error updating footer:', error);
      toast.error('Failed to update footer');
    }
  };

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            {isEditMode && (
              <button className="edit-icon" onClick={handleEdit} style={{position: 'absolute', top: '15px', right: '15px'}}>
                <FaEdit />
              </button>
            )}
            <p>{footerText}</p>
          </div>
        </div>
      </footer>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Footer</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Footer Text</label>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="© 2025 All rights reserved"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
