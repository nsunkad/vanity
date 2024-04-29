import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext.js';
import './MyBagPage.css';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import { LinkPreview } from '@dhaiwat10/react-link-preview';

const MyBagPage = () => {
  const { user } = useUser();
  const [bagItems, setBagItems] = useState([]);

  useEffect(() => {
    console.log('User ID:', user.user_id);
    // Fetch bag items data when component mounts
    fetchBagItems();
  }, []);

  const fetchBagItems = () => {
    fetch('http://localhost:8000/bag-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'userId': user.user_id
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setBagItems(data.success);
        }
      })
      .catch(error => console.error('Error fetching bag items:', error));
  };
  

  const firstName = user ? user.firstName : "User";

  return (
    <div className="mybag-container">
      <HamburgerMenu />
      <div className="mybag-header">
        <h1 className="mybag-name">{firstName}'s bag</h1>
        <div className="mybag-addIcon" />
      </div>
      
      <div className="mybag-bag">
        {bagItems.map((item, index) => (
          <div key={index} className="mybag-slot">
            {item.productName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBagPage;
