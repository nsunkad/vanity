import React, { useState } from 'react';
import './HamburgerMenu.css'; // Make sure to create this CSS file

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="hamburger-menu">
            <div className="menu-icon" onClick={toggleMenu}>
                <div className={isOpen ? "bar1 change" : "bar1"}></div>
                <div className={isOpen ? "bar2 change" : "bar2"}></div>
                <div className={isOpen ? "bar3 change" : "bar3"}></div>
            </div>
            {isOpen && (
                <div className="menu-items">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/services">Services</a>
                    <a href="/contact">Contact</a>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
