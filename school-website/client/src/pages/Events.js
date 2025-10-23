import React, { useState, useEffect } from 'react';
import { getEvents } from '../utils/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEvents({});
      setEvents(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="events-page section">
      <div className="container">
        <h1 className="section-title">Events</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {events.map((event) => (
            <div key={event._id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              {event.imageUrl && <img src={`http://localhost:5000${event.imageUrl}`} alt={event.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
              <div style={{ padding: '1.5rem' }}>
                <h3>{event.title}</h3>
                <p style={{ color: '#007bff', fontWeight: '600' }}>{new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}</p>
                {event.location && <p>📍 {event.location}</p>}
                <p>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
