import React, { useState } from 'react';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

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
                    <a href="/mybag">My Bag</a>
                    <a href="/friends">Find Friends</a>
                    <a href="/products">Product Lookup</a>
                    <a href="/">Logout</a>
                </div>
            )}
        </>
    );
};

export default HamburgerMenu;
