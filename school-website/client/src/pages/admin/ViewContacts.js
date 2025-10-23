import React, { useState, useEffect } from 'react';
import { getContacts, deleteContact } from '../../utils/api';
import { toast } from 'react-toastify';
import './AdminPages.css';

const ViewContacts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getContacts();
      setItems(res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch contacts');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteContact(id);
        toast.success('Message deleted');
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
          <h1>Contact Messages</h1>
        </div>

        {items.length === 0 ? (
          <div className="info-box">
            <h3>No messages yet</h3>
            <p>Contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone || '-'}</td>
                    <td>{item.subject || '-'}</td>
                    <td style={{maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.message}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewContacts;
