import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FriendBagPage.css';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const FriendBagPage = () => {
  const { UserName } = useParams();
  const navigate = useNavigate();
  const [bagItems, setBagItems] = useState([]);

  useEffect(() => {
    fetchBagItems(UserName);
  }, [UserName]);

  const fetchBagItems = (UserName) => {
    fetch(`http://localhost:8000/bag-items?username=${encodeURIComponent(UserName)}`, {
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
          <div className="slot-buttons">
            <FontAwesomeIcon icon={faSearch} className="slot-button view-button" onClick={() => navigate(`/productpage?product=${encodeURIComponent(item.productName)}&productId=${item.productId}`)} />
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default FriendBagPage;