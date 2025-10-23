import React, { useState, useEffect } from 'react';
import { getFaculty, createFaculty, updateFaculty, deleteFaculty } from '../../utils/api';
import { toast } from 'react-toastify';
import './AdminPages.css';

const ManageFaculty = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', designation: '', department: '', qualification: '', experience: '', email: '', specialization: '', isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getFaculty();
      setItems(res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch faculty');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (imageFile) formDataToSend.append('image', imageFile);

      if (editingId) {
        await updateFaculty(editingId, formDataToSend);
        toast.success('Faculty updated successfully');
      } else {
        await createFaculty(formDataToSend);
        toast.success('Faculty added successfully');
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', designation: '', department: '', qualification: '', experience: '', email: '', specialization: '', isActive: true });
      setImageFile(null);
      fetchData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      designation: item.designation,
      department: item.department || '',
      qualification: item.qualification || '',
      experience: item.experience || '',
      email: item.email || '',
      specialization: item.specialization || '',
      isActive: item.isActive
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteFaculty(id);
        toast.success('Faculty deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Manage Faculty</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : 'Add New Faculty'}
          </button>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <h2>{editingId ? 'Edit Faculty' : 'Add New Faculty'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Designation *</label>
                  <input type="text" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Qualification</label>
                  <input type="text" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Experience</label>
                  <input type="text" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input type="text" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Profile Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                  Active
                </label>
              </div>
              <button type="submit" className="btn btn-success">{editingId ? 'Update' : 'Add'}</button>
            </form>
          </div>
        )}

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.designation}</td>
                  <td>{item.department || '-'}</td>
                  <td>{item.email || '-'}</td>
                  <td><span className={`status ${item.isActive ? 'active' : 'inactive'}`}>{item.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button onClick={() => handleEdit(item)} className="btn btn-sm btn-primary">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageFaculty;
