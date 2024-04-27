import React, { useState } from 'react';
import { useUser } from '../../context/UserContext.js'; // Ensure correct path to your UserContext
import './MyBagPage.css';

const MyBagPage = () => {
  const { user } = useUser(); // Access user from context

  // Handle situations where there is no user data (user not logged in or data not loaded)
  const firstName = user ? user.firstName : "User";
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div className={"mybag-container"}>
      {menuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
      <div className={"mybag-header"}>
        <div className={"hamburger-menu"} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <h1 className={"mybag-name"}>{firstName}'s Bag</h1> {/* Dynamic user name */}
        <div className={"mybag-addIcon"} />
      </div>
      {menuOpen && (
        <div className={`menu-items ${menuOpen ? 'open' : ''}`}>
          <a href="/mybag">My Bag</a>
          <a href="/friends">Find Friends</a>
          <a href="/products">Product Lookup</a>
          <a href="/">Logout</a>
        </div>
      )}
      
      <div className={"mybag-bag"}>
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} className={"mybag-slot"}></div> // Corrected key to use index
        ))}
      </div>
    </div>
  );
};

export default MyBagPage;
