import React, { useState, useEffect } from 'react';
import { getAboutContent } from '../utils/api';

const About = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await getAboutContent();
      setContent(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="about-page section">
      <div className="container">
        <h1 className="section-title">About Our School</h1>
        {content.map((item) => (
          <div key={item._id} style={{ marginBottom: '3rem' }}>
            <h2>{item.title}</h2>
            {item.subtitle && <h3>{item.subtitle}</h3>}
            <p>{item.content || item.description}</p>
            {item.images && item.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {item.images.map((img, idx) => (
                  <img key={idx} src={`http://localhost:5000${img.url}`} alt={img.caption} style={{ width: '100%', borderRadius: '10px' }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
