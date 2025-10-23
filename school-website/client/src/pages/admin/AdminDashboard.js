import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page with edit mode
    navigate('/?editMode=true');
  }, [navigate]);

  return (
    <div className="loading">Redirecting to edit mode...</div>
  );
};

export default AdminDashboard;
