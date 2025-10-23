import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const getCurrentUser = () => API.get('/auth/me');
export const initAdmin = () => API.post('/auth/init');

// Content APIs
export const getContent = (section) => API.get(`/content${section ? `?section=${section}` : ''}`);
export const getContentById = (id) => API.get(`/content/${id}`);
export const createContent = (formData) => API.post('/content', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateContent = (id, formData) => API.put(`/content/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteContent = (id) => API.delete(`/content/${id}`);

// Gallery APIs
export const getGallery = (category, mediaType) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (mediaType) params.append('mediaType', mediaType);
  return API.get(`/gallery${params.toString() ? `?${params.toString()}` : ''}`);
};
export const getGalleryById = (id) => API.get(`/gallery/${id}`);
export const createGalleryImage = (formData) => API.post('/gallery', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const uploadGalleryImage = createGalleryImage; // Alias for consistency
export const updateGalleryImage = (id, formData) => API.put(`/gallery/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteGalleryImage = (id) => API.delete(`/gallery/${id}`);

// Events APIs
export const getEvents = (params) => API.get('/events', { params });
export const getEventById = (id) => API.get(`/events/${id}`);
export const createEvent = (formData) => API.post('/events', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateEvent = (id, formData) => API.put(`/events/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// Faculty APIs
export const getFaculty = (department) => API.get(`/faculty${department ? `?department=${department}` : ''}`);
export const getFacultyById = (id) => API.get(`/faculty/${id}`);
export const createFaculty = (formData) => API.post('/faculty', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateFaculty = (id, formData) => API.put(`/faculty/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteFaculty = (id) => API.delete(`/faculty/${id}`);

// Announcements APIs
export const getAnnouncements = (params) => API.get('/announcements', { params });
export const getAnnouncementById = (id) => API.get(`/announcements/${id}`);
export const createAnnouncement = (data) => API.post('/announcements', data);
export const updateAnnouncement = (id, data) => API.put(`/announcements/${id}`, data);
export const deleteAnnouncement = (id) => API.delete(`/announcements/${id}`);

// Contact APIs
export const submitContact = (data) => API.post('/contact', data);
export const getContacts = () => API.get('/contact');
export const markContactAsRead = (id) => API.put(`/contact/${id}/read`);
export const deleteContact = (id) => API.delete(`/contact/${id}`);

// About APIs
export const getAboutContent = () => API.get('/about');

export default API;
