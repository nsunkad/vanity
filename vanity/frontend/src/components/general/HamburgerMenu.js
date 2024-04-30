import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext.js';

import './HamburgerMenu.css';

const HamburgerMenu = () => {
    const { user } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        console.log('User ID:', user.user_id);
        console.log('User name:', user.firstName);
        // Fetch bag items data when component mounts
      }, []);

    return (
        <>
            {menuOpen && <div className="navigation-overlay" onClick={toggleMenu}></div>}
            <div className="hamburger-icon" onClick={toggleMenu}>
                <div className="hamburger-bar"></div>
                <div className="hamburger-bar"></div>
                <div className="hamburger-bar"></div>
            </div>
            {menuOpen && (
                <div className={`navigation-menu ${menuOpen ? 'open' : ''}`}>
                    <a href="http://localhost:3000/mybag">My Bag</a>
                    <a href="http://localhost:3000/friends">Find Friends</a>
                    <a href="http://localhost:3000/productsearch">Product Lookup</a>
                    <a href="/">Logout</a>
                </div>
            )}
        </>
    );
};

export default HamburgerMenu;
