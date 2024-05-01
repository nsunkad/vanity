import React, { useState } from 'react';
import './FriendSearchPage.css';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import { useUser } from '../../context/UserContext.js';
import { Search } from '../../components/general/Buttons.js';
import { useNavigate } from 'react-router-dom';

function FriendSearchPage() {
    const [searchInput, setSearchInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useUser();
    const navigate = useNavigate();


    const handleInputChange = (event) => {
        const { value } = event.target;
        setSearchInput(value);
    };

    const fetchSuggestions = () => {
        if (searchInput.length > 0) {
            const queryParams = new URLSearchParams({search: searchInput, self: user.userName}).toString();
            fetch(`http://localhost:8000/lookup-friends?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    navigate('/friendresults', { state: { results: data } });
                } else {
                    setErrorMessage(data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setErrorMessage('An error occurred. Please try again later.');
            });
        }
    };

    return (
        <div className="friends-lookup-container">
            <HamburgerMenu />
            <h1>find friends</h1>
            <div className="search-wrapper"> 
                <input
                    type="text"
                    value={searchInput}
                    onChange={handleInputChange}
                    placeholder="search by username"
                    className="search-input"
                />
                <Search onClick={fetchSuggestions} />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default FriendSearchPage;