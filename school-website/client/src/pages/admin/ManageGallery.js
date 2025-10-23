import React, { useState, useEffect } from 'react';
import { getGallery, uploadGalleryImage, updateGalleryImage, deleteGalleryImage } from '../../utils/api';
import { toast } from 'react-toastify';
import './AdminPages.css';

const ManageGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    category: 'events',
    mediaType: 'photo'
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchData();
  }, [filterType]);

  const fetchData = async () => {
    try {
      const mediaType = filterType === 'all' ? '' : filterType;
      const res = await getGallery('', mediaType);
      setItems(res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch gallery');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('mediaType', formData.mediaType);
      
      if (mediaFile) {
        formDataToSend.append('media', mediaFile);
      }
      
      if (thumbnailFile && formData.mediaType === 'video') {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      if (editingId) {
        await updateGalleryImage(editingId, formDataToSend);
        toast.success('Media updated successfully');
      } else {
        await uploadGalleryImage(formDataToSend);
        toast.success('Media uploaded successfully');
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ 
        title: '', 
        description: '', 
        category: 'events',
        mediaType: 'photo'
      });
      setMediaFile(null);
      setThumbnailFile(null);
      fetchData();
    } catch (error) {
      toast.error('Operation failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category,
      mediaType: item.mediaType || 'photo'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteGalleryImage(id);
        toast.success('Item deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ 
      title: '', 
      description: '', 
      category: 'events',
      mediaType: 'photo'
    });
    setMediaFile(null);
    setThumbnailFile(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Manage Gallery</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : 'Add New Media'}
          </button>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <h2>{editingId ? 'Edit Media' : 'Add New Media'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Media Type *</label>
                <select 
                  value={formData.mediaType} 
                  onChange={(e) => setFormData({...formData, mediaType: e.target.value})}
                  disabled={editingId}
                >
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="events">Events</option>
                  <option value="campus">Campus</option>
                  <option value="sports">Sports</option>
                  <option value="cultural">Cultural</option>
                  <option value="academic">Academic</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  {formData.mediaType === 'video' ? 'Video File *' : 'Image File *'}
                  {!editingId && ' (Required)'}
                </label>
                <input 
                  type="file" 
                  accept={formData.mediaType === 'video' ? 'video/*' : 'image/*'}
                  onChange={(e) => setMediaFile(e.target.files[0])} 
                  required={!editingId}
                />
                {formData.mediaType === 'video' && (
                  <small>Supported formats: MP4, WebM, OGG</small>
                )}
              </div>

              {formData.mediaType === 'video' && (
                <div className="form-group">
                  <label>Thumbnail Image (Optional but Recommended)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files[0])} 
                  />
                  <small>Upload a thumbnail image to show before the video plays</small>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-success">
                  {editingId ? 'Update' : 'Upload'}
                </button>
                <button type="button" onClick={cancelForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Filter by Type:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="all">All Media</option>
            <option value="photo">Photos Only</option>
            <option value="video">Videos Only</option>
          </select>
        </div>

        <div className="gallery-admin-grid">
          {items.map((item) => (
            <div key={item._id} className="gallery-admin-item">
              {item.mediaType === 'video' ? (
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  background: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {item.thumbnailUrl ? (
                    <img 
                      src={`${item.thumbnailUrl}`}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <video 
                      src={`${item.videoUrl}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      controls
                    />
                  )}
                </div>
              ) : (
                <img src={`${item.imageUrl}`} alt={item.title} />
              )}
              <div className="gallery-admin-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge">{item.category}</span>
                  <span className="badge" style={{ 
                    background: item.mediaType === 'video' ? '#f5576c' : '#667eea' 
                  }}>
                    {item.mediaType}
                  </span>
                </div>
                <div className="gallery-admin-actions">
                  <button onClick={() => handleEdit(item)} className="btn btn-sm btn-primary">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-danger">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <p>No items found. Click "Add New Media" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageGallery;
