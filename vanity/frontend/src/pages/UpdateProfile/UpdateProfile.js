import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import './UpdateProfile.css';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import { useNavigate } from 'react-router-dom';

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);

  if (!user || !user.userId) {
    console.error("User data or user ID is unavailable.");
  }

  const [username, setUsername] = useState(user.userName);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log('Attempting to update user profile with ID:', user.userId);
    const payload = {
      userid: user.userId,
      username,
      firstname: firstName,
      lastname: lastName,
      email,
    };

    // API call to update the user
    fetch('http://localhost:8000/update-account', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error('Update error:', data.error);
      } else {
        console.log('success');
        updateUser(data); // Update user context with new data
        setSuccessMessage('profile updated successfully'); // Set success message
      }
    })
    .catch((error) => {
      alert('An error occurred while updating the profile.');
      console.error('Error:', error);
    });
  };

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    fetch('http://localhost:8000/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.userId }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert('Failed to delete account: ' + data.error);
      } else {
        alert('Account deleted successfully');
        updateUser(null);
        navigate('/');
      }
    })
    .catch((error) => {
      alert('An error occurred while deleting the account.');
      console.error('Error:', error);
    });
  };

  return (
    <div className="profile-container">
      <HamburgerMenu />
      <h1>profile</h1>
      <form onSubmit={handleUpdate}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Update username" />
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Update first name" />
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Update last name" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Update email" />
        <button type="submit" className="vanity-button" id="save">Save</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>} {/* Render success message if it exists */}
      <button className="vanity-button" onClick={handleDelete} style={{marginTop: '20px'}}>DELETE ACCOUNT</button>
    </div>
  );
};

export default UpdateProfilePage;