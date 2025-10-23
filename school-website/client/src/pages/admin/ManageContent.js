import React, { useState, useEffect } from 'react';
import { getContent, createContent, updateContent, deleteContent } from '../../utils/api';
import { toast } from 'react-toastify';
import './AdminPages.css';

const ManageContent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    section: 'hero',
    title: '',
    subtitle: '',
    description: '',
    content: '',
    order: 0,
    isActive: true
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getContent();
      setItems(res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch content');
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

      if (editingId) {
        await updateContent(editingId, formDataToSend);
        toast.success('Content updated successfully');
      } else {
        await createContent(formDataToSend);
        toast.success('Content created successfully');
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ section: 'hero', title: '', subtitle: '', description: '', content: '', order: 0, isActive: true });
      fetchData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      section: item.section,
      title: item.title,
      subtitle: item.subtitle || '',
      description: item.description || '',
      content: item.content || '',
      order: item.order,
      isActive: item.isActive
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(id);
        toast.success('Content deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete content');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Manage Content</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : 'Add New Content'}
          </button>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <h2>{editingId ? 'Edit Content' : 'Add New Content'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Section</label>
                <select value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} required>
                  <option value="hero">Hero</option>
                  <option value="about">About</option>
                  <option value="mission">Mission</option>
                  <option value="vision">Vision</option>
                  <option value="values">Values</option>
                  <option value="facilities">Facilities</option>
                  <option value="achievements">Achievements</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows="5"></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                    Active
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-success">{editingId ? 'Update' : 'Create'}</button>
            </form>
          </div>
        )}

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Section</th>
                <th>Title</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td><span className="badge">{item.section}</span></td>
                  <td>{item.title}</td>
                  <td>{item.order}</td>
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

export default ManageContent;
