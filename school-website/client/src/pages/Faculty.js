import React, { useState, useEffect } from 'react';
import { getFaculty } from '../utils/api';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const res = await getFaculty();
      setFaculty(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="faculty-page section">
      <div className="container">
        <h1 className="section-title">Our Faculty</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {faculty.map((member) => (
            <div key={member._id} style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              {member.imageUrl && <img src={`http://localhost:5000${member.imageUrl}`} alt={member.name} style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem' }} />}
              <h3>{member.name}</h3>
              <p style={{ color: '#007bff', fontWeight: '600' }}>{member.designation}</p>
              {member.department && <p>{member.department}</p>}
              {member.qualification && <p><strong>Qualification:</strong> {member.qualification}</p>}
              {member.email && <p>📧 {member.email}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faculty;
