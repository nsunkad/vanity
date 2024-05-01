import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
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
export function SubmitButton() {
  return (
    <div>
      <button type="submit" className="vanity-button">submit</button>
    </div>
  );
}

export function MyBagButton() {
  const navigate = useNavigate();

  const navigateToMyBag = () => {
    navigate('/mybag');
  };

  return (
    <button onClick={navigateToMyBag} type="button" className="bag-button" >
      <FontAwesomeIcon icon={faShoppingBag} />
    </button>
  );
}

//Login link to redirect to login page
export function LogInLink() {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <span onClick={navigateToLogin} style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}>
      here
    </span>
  );
}

//Button to trigger product and friend searches
export function Search({onClick}){
  return (
    <button onClick={onClick} type="button" className="search-button" >
      <FontAwesomeIcon icon={faCircleArrowRight} />
    </button>
  );
}