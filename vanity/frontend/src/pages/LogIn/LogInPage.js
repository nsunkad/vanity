import React, { useState } from 'react';
import './LoginPage.css';
import { SubmitButton } from '../../components/general/Buttons.js';
import { useUser } from '../../context/UserContext.js';

import { MyBagButton } from '../../components/general/Buttons.js';

function LogInPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user, login } = useUser(); // Using context to manage user data
    const [loginSuccessful, setLoginSuccessful] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
          console.log('Response:', response); // logging response
          return response.json();})
        .then(data => {
            console.log('Data:', data); // logging data
            if (data.user_id) {  // Assuming `user_id` presence indicates success
                login(data);   // Update user context with received user info
                setLoginSuccessful(true);
            } else {
                setErrorMessage(data.error || 'Unknown error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again later.');
            setLoginSuccessful(false);
        });
    };

    return (
        <div className="login-container">
            <h1>log in</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        name="username"
                        type="text"
                        value={username}
                        onChange={handleInputChange}
                        placeholder="username"
                    />
                </div>
                <div className="input-container">
                    <input
                        name="password"
                        type="password"
                        value={password}
                        onChange={handleInputChange}
                        placeholder="password"
                    />
                </div>
                <SubmitButton/>
                {loginSuccessful && user && (
                    <>
                        <p className="login-success">Welcome to Vanity, {user.firstName}!</p>
                        <MyBagButton />
                    </>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
}

export default LogInPage;
