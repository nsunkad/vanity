import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import "./Buttons.css";

// LoginButton Component
export function LogInButton() {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <button onClick={navigateToLogin} className="vanity-button">log in</button>
  );
}

// SignUpButton Component
export function SignUpButton() {
  const navigate = useNavigate();

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  return (
    <button onClick={navigateToSignUp} className="vanity-button">sign up</button>
  );
}

//SubmitButton Component
export function SubmitButton({onSubmit}) {
  return (
    <div>
      <button onClick={onSubmit} className="vanity-button">submit</button>
    </div>
    
); }

export function MyBagButton() {
  const navigate = useNavigate();

  const navigateToMyBag = () => {
    navigate('/mybag');
  };

  return (
    <button onClick={navigateToMyBag} className="bag-button">
      <FontAwesomeIcon icon={faShoppingBag} />
    </button>
  );
}