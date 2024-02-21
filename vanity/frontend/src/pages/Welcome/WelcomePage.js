import React from 'react';
import './WelcomePage.css'; // Assuming your CSS file is named WelcomePage.css

function WelcomePage() {
  // You might use a routing solution like React Router for navigation
  // For demonstration purposes, we're using simple callbacks
  const navigateToLogin = () => {
    // Navigation logic to LogInPage
  };

  const navigateToSignUp = () => {
    // Navigation logic to SignUpPage
  };

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">vanity.</h1>
      <div className="welcome-actions">
        <button onClick={navigateToLogin} className="welcome-button">log in</button>
        <button onClick={navigateToSignUp} className="welcome-button">sign up</button>
      </div>
    </div>
  );
}

export default WelcomePage;
