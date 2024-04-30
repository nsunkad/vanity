import React from 'react';
import './WelcomePage.css'; // Assuming your CSS file is named WelcomePage.css
import {LogInButton, SignUpButton} from '../../components/general/Buttons.js';

function WelcomePage() {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">vanity.</h1>
      <div className="welcome-actions">
        <LogInButton/>
        <SignUpButton/>
      </div>
    </div>
  );
}

export default WelcomePage;