import React, { useState, useEffect } from 'react';
import { getGallery } from '../utils/api';
import './Gallery.css';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const photosResponse = await getGallery('', 'photo');
      const videosResponse = await getGallery('', 'video');
      setPhotos(photosResponse.data || []);
      setVideos(videosResponse.data || []);
    } catch (error) {
      console.error('Error loading media:', error);
    }
  };

  return (
    <div style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '3rem' }}>Gallery</h1>
      
      {/* TWO BOXES */}
      <div style={{ 
        display: 'flex', 
        gap: '3rem', 
        maxWidth: '900px', 
        margin: '0 auto',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        
        {/* PHOTOS BOX */}
        <div 
          onClick={() => setShowPhotos(true)}
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
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{photos.length} Photos</p>
        </div>

        {/* VIDEOS BOX */}
        <div 
          onClick={() => setShowVideos(true)}
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
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{videos.length} Videos</p>
        </div>
      </div>

      {/* PHOTOS OVERLAY */}
      {showPhotos && (
        <div 
          onClick={() => setShowPhotos(false)}
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
                onClick={() => setShowPhotos(false)}
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
              {photos.map((photo) => (
                <div 
                  key={photo._id}
                  onClick={() => setSelectedItem(photo)}
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(255,255,255,0.1)'
                  }}
                >
                  <img 
                    src={`http://localhost:5000${photo.imageUrl}`}
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

      {/* VIDEOS OVERLAY */}
      {showVideos && (
        <div 
          onClick={() => setShowVideos(false)}
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
                onClick={() => setShowVideos(false)}
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
              {videos.map((video) => (
                <div 
                  key={video._id}
                  onClick={() => setSelectedItem(video)}
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(255,255,255,0.1)'
                  }}
                >
                  {video.thumbnailUrl ? (
                    <img 
                      src={`http://localhost:5000${video.thumbnailUrl}`}
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

      {/* FULL SCREEN VIEWER */}
      {selectedItem && (
        <div 
          onClick={() => setSelectedItem(null)}
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
            onClick={() => setSelectedItem(null)}
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
          
          {selectedItem.mediaType === 'photo' ? (
            <img 
              src={`http://localhost:5000${selectedItem.imageUrl}`}
              alt={selectedItem.title}
              style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '10px' }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video 
              src={`http://localhost:5000${selectedItem.videoUrl}`}
              controls
              autoPlay
              style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '10px' }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
