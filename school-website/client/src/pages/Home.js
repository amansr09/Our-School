import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getContent, getAnnouncements, getEvents, getGallery, getFaculty, submitContact, updateContent, updateEvent, updateFaculty, updateAnnouncement, deleteAnnouncement, deleteEvent, deleteFaculty, deleteGalleryImage } from '../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaUser } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditMode = searchParams.get('editMode') === 'true' && localStorage.getItem('token');
  
  const [heroContent, setHeroContent] = useState(null);
  const [aboutContent, setAboutContent] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [programsContent, setProgramsContent] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  
  // Gallery modal states
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [selectedMediaItem, setSelectedMediaItem] = useState(null);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState('');
  const [editData, setEditData] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchData();
    
    // Restore scroll position after page load
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
        sessionStorage.removeItem('scrollPosition');
      }, 100);
    }
    
    // Save scroll position on any scroll
    const handleScroll = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };
    
    // Save scroll position before page unload
    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [heroRes, aboutRes, announcementsRes, eventsRes, photosRes, videosRes, facultyRes, programsRes, contactRes] = await Promise.all([
        getContent('hero'),
        getContent('about'),
        getAnnouncements({ priority: 'high' }),
        getEvents({ upcoming: 'true' }),
        getGallery('', 'photo'),
        getGallery('', 'video'),
        getFaculty(),
        getContent('programs'),
        getContent('contact')
      ]);

      setHeroContent(heroRes.data[0]);
      setAboutContent(aboutRes.data);
      setAnnouncements(announcementsRes.data.slice(0, 3));
      setEvents(eventsRes.data.slice(0, 6));
      setGalleryPhotos(photosRes.data || []);
      setGalleryVideos(videosRes.data || []);
      setFaculty(facultyRes.data.slice(0, 8));
      setProgramsContent(programsRes.data);
      setContactInfo(contactRes.data[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleEdit = (type, data) => {
    setEditType(type);
    setEditData(data);
    setEditFormData(data || {});
    setShowEditModal(true);
    // Prevent background scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleSaveEdit = async () => {
    try {
      if (editType === 'hero') {
        const formData = new FormData();
        formData.append('section', editData.section || editType);
        formData.append('title', editFormData.title || '');
        formData.append('subtitle', editFormData.subtitle || '');
        formData.append('content', editFormData.content || editFormData.description || '');
        formData.append('order', editData.order || 0);
        formData.append('isActive', editData.isActive !== undefined ? editData.isActive : true);
        
        // If new image uploaded, don't include existing images (replace instead of append)
        if (editFormData.image) {
          formData.append('images', editFormData.image);
        } else if (editData.images && editData.images.length > 0) {
          // Only keep existing images if no new image uploaded
          formData.append('existingImages', JSON.stringify(editData.images));
        }
        
        const response = await updateContent(editData._id, formData);
        
        // Update state immediately with new data
        setHeroContent(response.data);
        
        toast.success('Content updated successfully');
      } else if (editType === 'program' || editType === 'contact') {
        const response = await updateContent(editData._id, editFormData);
        
        toast.success('Content updated successfully');
      } else if (editType === 'about') {
        const formData = new FormData();
        formData.append('section', editData.section || editType);
        formData.append('title', editFormData.title || '');
        formData.append('subtitle', editFormData.subtitle || '');
        formData.append('content', editFormData.content || editFormData.description || '');
        formData.append('order', editData.order || 0);
        formData.append('isActive', editData.isActive !== undefined ? editData.isActive : true);
        
        // If new image uploaded, don't include existing images (replace instead of append)
        if (editFormData.image) {
          formData.append('images', editFormData.image);
        } else if (editData.images && editData.images.length > 0) {
          // Only keep existing images if no new image uploaded
          formData.append('existingImages', JSON.stringify(editData.images));
        }
        
        const response = await updateContent(editData._id, formData);
        
        // Update state immediately with new data
        setAboutContent([response.data]);
        
        toast.success('Content updated successfully');
      } else if (editType === 'announcement') {
        const response = await updateAnnouncement(editData._id, editFormData);
        
        // Update state immediately
        setAnnouncements(announcements.map(a => 
          a._id === editData._id ? response.data : a
        ));
        
        toast.success('Announcement updated successfully');
      } else if (editType === 'event') {
        const response = await updateEvent(editData._id, editFormData);
        
        // Update state immediately
        setEvents(events.map(e => 
          e._id === editData._id ? response.data : e
        ));
        
        toast.success('Event updated successfully');
      } else if (editType === 'faculty') {
        const formData = new FormData();
        formData.append('name', editFormData.name);
        formData.append('designation', editFormData.designation);
        formData.append('department', editFormData.department || '');
        formData.append('qualification', editFormData.qualification || '');
        formData.append('email', editFormData.email || '');
        formData.append('experience', editFormData.experience || '');
        formData.append('specialization', editFormData.specialization || '');
        
        if (editFormData.image) {
          formData.append('image', editFormData.image);
        }
        
        const response = await updateFaculty(editData._id, formData);
        
        // Update state immediately
        setFaculty(faculty.map(f => 
          f._id === editData._id ? response.data : f
        ));
        
        toast.success('Faculty updated successfully');
      }
      setShowEditModal(false);
      // Re-enable background scroll
      document.body.style.overflow = 'unset';
    } catch (error) {
      toast.error('Failed to update');
      setShowEditModal(false);
      document.body.style.overflow = 'unset';
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    
    try {
      if (type === 'announcement') {
        await deleteAnnouncement(id);
      } else if (type === 'event') {
        await deleteEvent(id);
      } else if (type === 'faculty') {
        await deleteFaculty(id);
      } else if (type === 'gallery') {
        await deleteGalleryImage(id);
      }
      toast.success('Deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContact(contactForm);
      toast.success('Message sent successfully!');
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleAddNew = (type) => {
    navigate(`/admin/${type}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home single-page">
      {/* Edit Mode Banner */}
      {isEditMode && (
        <div className="edit-mode-banner">
          <span>✏️ Edit Mode Active - Click edit icons to modify content</span>
          <button onClick={() => navigate('/')} className="btn btn-sm">Exit Edit Mode</button>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="hero">
        {isEditMode && (
          <button className="edit-icon" onClick={() => handleEdit('hero', heroContent)}>
            <FaEdit />
          </button>
        )}
        <div className="hero-overlay">
          <div className="container">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {/* Left side - Circular Image */}
              <div style={{
                flex: '0 0 auto',
                position: 'relative'
              }}>
                <img 
                  key={heroContent?.images?.[0]?.url || 'hero-default'}
                  src={heroContent?.images?.[0]?.url ? `${heroContent.images[0].url}` : "/images/illustration.webp"}
                  alt="Hero"
                  className="hero-circle-image"
                />
              </div>
              
              {/* Right side - Content */}
              <div className="hero-content" style={{ flex: '1', minWidth: '300px' }}>
                <h1>{heroContent?.title || 'Welcome to Our School'}</h1>
                <p>{heroContent?.subtitle || 'Excellence in Education'}</p>
                <div className="hero-buttons">
                  <a href="#about" className="btn btn-primary">Learn More</a>
                  <a href="#contact" className="btn btn-secondary">Contact Us</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <section id="announcements" className="section announcements-section">
          <div className="container">
            <div className="section-header-with-add">
              <h2 className="section-title">Latest Announcements</h2>
              {isEditMode && (
                <button className="add-btn" onClick={() => handleAddNew('announcements')}>
                  <FaPlus /> Add New
                </button>
              )}
            </div>
            <div className="announcements-grid">
              {announcements.map((announcement) => (
                <div key={announcement._id} className={`announcement-card ${announcement.priority}`}>
                  {isEditMode && (
                    <div className="card-actions">
                      <button onClick={() => handleEdit('announcement', announcement)}><FaEdit /></button>
                      <button onClick={() => handleDelete('announcement', announcement._id)}><FaTrash /></button>
                    </div>
                  )}
                  <div className="announcement-type">{announcement.type}</div>
                  <h3>{announcement.title}</h3>
                  <p>{announcement.content}</p>
                  <span className="announcement-date">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <h2 className="section-title">About Our School</h2>
          <div style={{ 
            display: 'flex', 
            gap: '3rem', 
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            {/* Left side - Image */}
            <div style={{ 
              flex: '1', 
              minWidth: '300px',
              display: 'flex',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {isEditMode && aboutContent.length > 0 && (
                <button 
                  className="edit-icon" 
                  onClick={() => handleEdit('about', aboutContent[0])}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10
                  }}
                >
                  <FaEdit />
                </button>
              )}
              <img 
                key={aboutContent[0]?.images?.[0]?.url || 'default'}
                src={aboutContent[0]?.images?.[0]?.url ? `${aboutContent[0].images[0].url}` : "/images/illustration.webp"}
                alt="About Our School" 
                style={{ 
                  width: '100%', 
                  maxWidth: '500px',
                  height: 'auto',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }} 
              />
            </div>
            
            {/* Right side - Content */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              {aboutContent.length > 0 ? (
                aboutContent.map((item) => (
                  <div key={item._id} className="about-content">
                    <h3>{item.title}</h3>
                    {item.subtitle && <h4>{item.subtitle}</h4>}
                    <p>{item.content || item.description}</p>
                  </div>
                ))
              ) : (
                <div className="about-content">
                  <h3>Welcome to Our School</h3>
                  <p>We are committed to providing excellence in education and nurturing future leaders. Our dedicated faculty and state-of-the-art facilities create an environment where students can thrive academically, socially, and personally.</p>
                  <p>With a focus on holistic development, we prepare our students for success in an ever-changing world through innovative teaching methods and comprehensive programs.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs Section */}
      <section id="programs" className="section programs-section">
        <div className="container">
          <h2 className="section-title">Academic Programs</h2>
          <p className="section-subtitle">Comprehensive Curriculum for All Levels</p>
          
          <div className="programs-grid">
            {programsContent.length > 0 ? (
              programsContent.map((program) => (
                <div key={program._id} className="program-card">
                  {isEditMode && (
                    <button className="edit-icon" onClick={() => handleEdit('program', program)}>
                      <FaEdit />
                    </button>
                  )}
                  <div className="program-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                    </svg>
                  </div>
                  <h3>{program.title}</h3>
                  <p className="program-description">{program.subtitle}</p>
                  <div dangerouslySetInnerHTML={{ __html: program.content }} />
                </div>
              ))
            ) : (
              <>
                <div className="program-card">
                  <div className="program-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <h3>Primary Education</h3>
                  <p className="program-description">Grades 1-5: Building strong foundations in core subjects with interactive learning methods.</p>
                  <ul className="program-features">
                    <li>✓ English & Language Arts</li>
                    <li>✓ Mathematics</li>
                    <li>✓ Science & Environment</li>
                    <li>✓ Arts & Crafts</li>
                  </ul>
                </div>

                <div className="program-card">
                  <div className="program-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                    </svg>
                  </div>
                  <h3>Middle School</h3>
                  <p className="program-description">Grades 6-8: Developing critical thinking and analytical skills across diverse subjects.</p>
                  <ul className="program-features">
                    <li>✓ Advanced Mathematics</li>
                    <li>✓ Physical Sciences</li>
                    <li>✓ Social Studies</li>
                    <li>✓ Computer Science</li>
                  </ul>
                </div>

                <div className="program-card">
                  <div className="program-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                    </svg>
                  </div>
                  <h3>High School</h3>
                  <p className="program-description">Grades 9-12: Preparing students for higher education and career success.</p>
                  <ul className="program-features">
                    <li>✓ Science Stream</li>
                    <li>✓ Commerce Stream</li>
                    <li>✓ Arts & Humanities</li>
                    <li>✓ Advanced Placement</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="section gallery-section">
        <div className="container">
          <div className="section-header-with-add">
            <h2 className="section-title">Gallery</h2>
            {isEditMode && (
              <button className="add-btn" onClick={() => handleAddNew('gallery')}>
                <FaPlus /> Add New
              </button>
            )}
          </div>
          
          {/* Two Boxes for Photos and Videos */}
          <div style={{ 
            display: 'flex', 
            gap: '3rem', 
            maxWidth: '900px', 
            margin: '2rem auto',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            
            {/* PHOTOS BOX */}
            <div 
              onClick={() => setShowPhotosModal(true)}
              style={{
                width: '350px',
                height: '350px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s',
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📷</div>
              <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>See All Photos</h2>
              <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{galleryPhotos.length} Photos</p>
            </div>

            {/* VIDEOS BOX */}
            <div 
              onClick={() => setShowVideosModal(true)}
              style={{
                width: '350px',
                height: '350px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s',
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎥</div>
              <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>See All Videos</h2>
              <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{galleryVideos.length} Videos</p>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTOS MODAL */}
      {showPhotosModal && (
        <div 
          onClick={() => setShowPhotosModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 1000,
            padding: '2rem',
            overflowY: 'auto'
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: 'white', fontSize: '2rem' }}>All Photos</h2>
              <button 
                onClick={() => setShowPhotosModal(false)}
                style={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >×</button>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {galleryPhotos.map((photo) => (
                <div 
                  key={photo._id}
                  onClick={() => setSelectedMediaItem(photo)}
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(255,255,255,0.1)',
                    position: 'relative'
                  }}
                >
                  {isEditMode && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete('gallery', photo._id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        zIndex: 10
                      }}
                    >
                      <FaTrash />
                    </button>
                  )}
                  <img 
                    src={`${photo.imageUrl}`}
                    alt={photo.title}
                    style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1rem', background: 'white' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{photo.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{photo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIDEOS MODAL */}
      {showVideosModal && (
        <div 
          onClick={() => setShowVideosModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 1000,
            padding: '2rem',
            overflowY: 'auto'
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: 'white', fontSize: '2rem' }}>All Videos</h2>
              <button 
                onClick={() => setShowVideosModal(false)}
                style={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >×</button>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {galleryVideos.map((video) => (
                <div 
                  key={video._id}
                  onClick={() => setSelectedMediaItem(video)}
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(255,255,255,0.1)',
                    position: 'relative'
                  }}
                >
                  {isEditMode && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete('gallery', video._id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        zIndex: 10
                      }}
                    >
                      <FaTrash />
                    </button>
                  )}
                  {video.thumbnailUrl ? (
                    <img 
                      src={`${video.thumbnailUrl}`}
                      alt={video.title}
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '250px', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem'
                    }}>▶️</div>
                  )}
                  <div style={{ padding: '1rem', background: 'white' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{video.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULL SCREEN MEDIA VIEWER */}
      {selectedMediaItem && (
        <div 
          onClick={() => setSelectedMediaItem(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <button 
            onClick={() => setSelectedMediaItem(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '2rem',
              cursor: 'pointer',
              zIndex: 10
            }}
          >×</button>
          
          {selectedMediaItem.mediaType === 'photo' ? (
            <img 
              src={`${selectedMediaItem.imageUrl}`}
              alt={selectedMediaItem.title}
              style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '10px' }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video 
              src={`${selectedMediaItem.videoUrl}`}
              controls
              autoPlay
              style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '10px' }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}

      {/* Faculty Section */}
      <section id="faculty" className="section faculty-section">
        <div className="container">
          <div className="section-header-with-add">
            <h2 className="section-title">Our Faculty</h2>
            {isEditMode && (
              <button className="add-btn" onClick={() => handleAddNew('faculty')}>
                <FaPlus /> Add New
              </button>
            )}
          </div>
          {faculty.length > 0 ? (
            <div className="faculty-grid">
              {faculty.map((member) => (
                <div key={member._id} className="faculty-card">
                  {isEditMode && (
                    <div className="card-actions">
                      <button onClick={() => handleEdit('faculty', member)}><FaEdit /></button>
                      <button onClick={() => handleDelete('faculty', member._id)}><FaTrash /></button>
                    </div>
                  )}
                  <div className="faculty-image-wrapper">
                    {member.imageUrl ? (
                      <img src={`${member.imageUrl}`} alt={member.name} />
                    ) : (
                      <div className="faculty-default-icon">
                        <FaUser />
                      </div>
                    )}
                  </div>
                  <h3>{member.name}</h3>
                  <p className="faculty-designation">{member.designation}</p>
                  {member.department && <p className="faculty-department">{member.department}</p>}
                  {member.qualification && <p><strong>Qualification:</strong> {member.qualification}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-content">Faculty information will appear here.</p>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <h2 className="section-title">Contact Us</h2>
          <div className="contact-content">
            <div className="contact-info">
              {isEditMode && contactInfo && (
                <button className="edit-icon" onClick={() => handleEdit('contact', contactInfo)}>
                  <FaEdit />
                </button>
              )}
              <h3>{contactInfo?.title || 'Get in Touch'}</h3>
              <p>📧 Email: {contactInfo?.content?.split('\n')[0] || 'info@school.com'}</p>
              <p>📞 Phone: {contactInfo?.content?.split('\n')[1] || '+1 234 567 8900'}</p>
              <p>📍 Address: {contactInfo?.content?.split('\n')[2] || '123 School Street, City, State'}</p>
            </div>
            <div className="contact-form-wrapper">
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Your Email *"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Your Message *"
                    rows="5"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => {
          setShowEditModal(false);
          document.body.style.overflow = 'unset';
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit {editType}</h2>
            <div className="modal-form">
              {editType === 'hero' && (
                <>
                  <div className="form-group">
                    <label>Hero Image (Circular)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditFormData({...editFormData, image: e.target.files[0]})}
                    />
                    {editFormData.images?.[0]?.url && (
                      <div style={{marginTop: '1rem', textAlign: 'center'}}>
                        <img 
                          src={`${editFormData.images[0].url}`} 
                          alt="Current" 
                          style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover'}}
                        />
                        <p style={{fontSize: '0.9rem', color: '#666', marginTop: '0.5rem'}}>Current Image</p>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subtitle</label>
                    <input
                      type="text"
                      value={editFormData.subtitle || ''}
                      onChange={(e) => setEditFormData({...editFormData, subtitle: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Content</label>
                    <textarea
                      value={editFormData.content || editFormData.description || ''}
                      onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                      rows="5"
                    />
                  </div>
                </>
              )}
              {editType === 'about' && (
                <>
                  <div className="form-group">
                    <label>About Section Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditFormData({...editFormData, image: e.target.files[0]})}
                    />
                    {editFormData.images?.[0]?.url && (
                      <div style={{marginTop: '1rem', textAlign: 'center'}}>
                        <img 
                          src={`${editFormData.images[0].url}`} 
                          alt="Current" 
                          style={{width: '200px', height: 'auto', borderRadius: '10px'}}
                        />
                        <p style={{fontSize: '0.9rem', color: '#666', marginTop: '0.5rem'}}>Current Image</p>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subtitle</label>
                    <input
                      type="text"
                      value={editFormData.subtitle || ''}
                      onChange={(e) => setEditFormData({...editFormData, subtitle: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Content</label>
                    <textarea
                      value={editFormData.content || editFormData.description || ''}
                      onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                      rows="5"
                    />
                  </div>
                </>
              )}
              {(editType === 'program' || editType === 'contact') && (
                <>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subtitle</label>
                    <input
                      type="text"
                      value={editFormData.subtitle || ''}
                      onChange={(e) => setEditFormData({...editFormData, subtitle: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Content</label>
                    <textarea
                      value={editFormData.content || editFormData.description || ''}
                      onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                      rows="5"
                    />
                  </div>
                </>
              )}
              {editType === 'announcement' && (
                <>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Content</label>
                    <textarea
                      value={editFormData.content || ''}
                      onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                      rows="4"
                    />
                  </div>
                </>
              )}
              {editType === 'event' && (
                <>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={editFormData.description || ''}
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={editFormData.location || ''}
                      onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                    />
                  </div>
                </>
              )}
              {editType === 'faculty' && (
                <>
                  <div className="form-group">
                    <label>Profile Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditFormData({...editFormData, image: e.target.files[0]})}
                    />
                    {editFormData.imageUrl && (
                      <div style={{marginTop: '1rem', textAlign: 'center'}}>
                        <img 
                          src={`${editFormData.imageUrl}`} 
                          alt="Current" 
                          style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover'}}
                        />
                        <p style={{fontSize: '0.9rem', color: '#666', marginTop: '0.5rem'}}>Current Photo</p>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      value={editFormData.designation || ''}
                      onChange={(e) => setEditFormData({...editFormData, designation: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      value={editFormData.department || ''}
                      onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Qualification</label>
                    <input
                      type="text"
                      value={editFormData.qualification || ''}
                      onChange={(e) => setEditFormData({...editFormData, qualification: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={() => {
                setShowEditModal(false);
                document.body.style.overflow = 'unset';
              }} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSaveEdit} className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
