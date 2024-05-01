import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext.js';
import { useParams, useNavigate } from 'react-router-dom'; // Needed to retrieve URL parameters
import './MyBagPage.css';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const MyBagPage = () => {
  const { user } = useUser();
  const [bagItems, setBagItems] = useState([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [productId, setProductId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.userId) {
      console.log('User ID:', user.userId);
      console.log('User name:', user.firstName);
      fetchBagItems(); // Call the function to fetch bag items when the component mounts
    }
  }, [user]);

  const fetchBagItems = (userId) => {
    fetch(`http://localhost:8000/bag-items?username=${user.userName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
        setBagItems(data.success);
      }
    })
    .catch((error) => {
      console.error('Error fetching bag items:', error);
    });
  };

  const handleAddItem = (event) => {
    //event.preventDefault();  // Prevent the form from causing a page reload
    fetch('http://localhost:8000/create-bag-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.userId, productId: productId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error('Error:', data.error);
      } else {
        console.log('Bag Items:', data.success);
        setBagItems(prevItems => [...prevItems, data]);  // Assuming the API returns the added item
        setShowAddItemForm(false);  // Close the form after submission
        setProductId('');  // Reset the input field
      }
    })
    .catch(error => {
      console.error('Error fetching bag items:', error);
    });
  };

  const deleteItem = (userId, productId) => {
    fetch(`http://localhost:8000/delete-bag-item?userId=${encodeURIComponent(user.userId)}&productId=${encodeURIComponent(productId)}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Item deleted successfully');
        fetchBagItems(user.firstName); // Refresh items after delete
      } else {
        alert('Error deleting item: ' + data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="mybag-container">
      <HamburgerMenu />
      <div className="mybag-header">
        <h1 className="mybag-name">{user.firstName}'s bag</h1>
        <div className="mybag-addIcon" onClick={() => setShowAddItemForm(prev => !prev)}>
          <FontAwesomeIcon icon={faPlus} />
      </div>
      </div>
      {showAddItemForm && (
        <form onSubmit={handleAddItem} className="add-item-form">
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="enter product id"
            required
          />
          <button type="submit">add product</button>
        </form>
      )}
      <div className="mybag-bag">
        {/* Map over bagItems to display each product's name */}
        {bagItems.map((item, index) => (
          <div key={item.productId} className="mybag-slot">
            {item.productName}
            <div className="slot-buttons">
            <FontAwesomeIcon icon={faTimes} className="slot-button delete-button" onClick={() => deleteItem(user.firstName, item.productId)} />
            <FontAwesomeIcon icon={faSearch} className="slot-button view-button" onClick={() => navigate(`/productpage?product=${encodeURIComponent(item.productName)}&productId=${item.productId}`)} />
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBagPage;

