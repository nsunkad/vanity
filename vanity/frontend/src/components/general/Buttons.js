import React from 'react';
import { useNavigate } from 'react-router-dom';
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

// Placeholder for SubmitButton Component
// You can define and export the SubmitButton similarly
export function SubmitButton({onSubmit}) {
  return (
    <button onClick={onSubmit} className="vanity-button">submit</button>
);

}
