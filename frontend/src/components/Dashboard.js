import React, { useState, useEffect } from 'react';

const Dashboard = ({ user }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Feature: User management - Admin can view users [cite: 50]
    if (user && user.role === 'ADMIN') {
      fetch('http://localhost:3000/api/users')
        .then(res => res.json())
        .then(data => setAllUsers(data))
        .catch(err => console.error("Error fetching users:", err));
    }
  }, [user]);

  // Feature: Search keyword search [cite: 58]
  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (userId) => {
  if (window.confirm("Are you sure you want to delete this user?")) {
    fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'DELETE',
    })
    .then(res => {
      if (res.ok) {
        // Mise à jour de l'affichage local après suppression
        setAllUsers(allUsers.filter(u => u.id !== userId));
      } else {
        alert("Failed to delete user");
      }
    })
    .catch(err => console.error("Error:", err));
  }
};

  return (
    <div style={{ marginTop: '20px' }}>
      {user.role === 'ADMIN' ? (
        <div style={{ padding: '20px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '8px' }}>
          <h2>Admin Dashboard</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{u.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{u.email}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{u.role}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {u.role !== 'ADMIN' ? (
                    <button 
                        onClick={() => handleDelete(u.id)}
                        style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                        Delete
                    </button>
                    ) : (<span style={{ color: '#999' }}>No delete</span>)}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ padding: '20px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px' }}>
          <h2>Student Space</h2>
          <p>Welcome, {user.name}. You can update only your profile here[cite: 51].</p>
          <div style={{ padding: '15px', background: 'white', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <strong>Status:</strong> <span style={{ color: '#0369a1' }}>Pending Admission</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;