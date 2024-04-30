import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext.js';
import './MyBagPage.css';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import { LinkPreview } from '@dhaiwat10/react-link-preview';

const MyBagPage = () => {
  const { user } = useUser();
  const [bagItems, setBagItems] = useState([]);

  useEffect(() => {
    if (user && user.user_id) {
      console.log('User ID:', user.user_id);
      console.log('User name:', user.firstName);
      fetchBagItems(); // Call the function to fetch bag items when the component mounts
    }
  }, [user]);

  const fetchBagItems = () => {
    // API call to get bag items
    fetch('http://localhost:8000/bag-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: String(user.user_id) }), // Make sure to send the correct user ID
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log('Bag Items:', data.success);
        setBagItems(data.success); // Set the bag items to state
      }
    })
    .catch((error) => {
      console.error('Error fetching bag items:', error);
    });
  };

  return (
    <div className="mybag-container">
      <HamburgerMenu />
      <div className="mybag-header">
        <h1 className="mybag-name">{user.firstName}'s bag</h1>
        <div className="mybag-addIcon" />
      </div>
      <div className="mybag-bag">
        {/* Map over bagItems to display each product's name */}
        {bagItems.map((item, index) => (
          <div key={item.productId} className="mybag-slot">
            {item.productName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBagPage;

