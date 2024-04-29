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
    console.log('User name:', user.firstName);
    // Fetch bag items data when component mounts
  }, []);
  const firstName = user ? user.firstName : "User";

  return (
    <div className="mybag-container">
      <HamburgerMenu />
      <div className="mybag-header">
        <h1 className="mybag-name">{firstName}'s bag</h1>
        <div className="mybag-addIcon" />
      </div>
    </div>
  );
};

export default MyBagPage;

