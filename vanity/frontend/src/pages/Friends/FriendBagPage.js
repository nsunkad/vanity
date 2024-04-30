import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Needed to retrieve URL parameters
import './FriendBagPage.css';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';

const FriendBagPage = () => {
  const { UserName } = useParams(); // Retrieve username from URL
  const [bagItems, setBagItems] = useState([]);

  useEffect(() => {
    fetchBagItems(UserName);
  }, [UserName]);

  const fetchBagItems = (UserName) => {
    fetch(`http://localhost:8000/bag-items?userid=${encodeURIComponent(UserName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setBagItems(data.success);
      } else {
        console.error('Error:', data.error);
      }
    })
    .catch(error => {
      console.error('Error fetching bag items:', error);
    });
  };

  return (
    <div className="friendbag-container">
      <HamburgerMenu />
      <div className="friendbag-header">
        <h1 className="friendbag-name">{UserName}'s Bag</h1>
      </div>
      <div className="friendbag-bag">
        {bagItems.map((item, index) => (
          <div key={index} className="friendbag-slot">
            {item.productName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendBagPage;
