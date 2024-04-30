import React, { useState, useRef, useEffect } from 'react';
import './FriendSearchPage.css';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import { useUser } from '../../context/UserContext.js';

function FriendSearchPage() {
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useUser();
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleInputChange = (event) => {
        const { value } = event.target;
        setSearchInput(value);
        if (value.length > 0) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const fetchSuggestions = (search) => {
        const queryParams = new URLSearchParams({search: search, self: user.username}).toString();
        fetch(`http://localhost:8000/lookup-friends?${queryParams}`, {
            method: 'GET',  // You can actually change this to GET if you're just querying data
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                setSuggestions(data);
            } else {
                setErrorMessage(data.error);
                setSuggestions([]);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        });
    };
    

    const redirectToFriendBagPage = (userName) => {
        window.location.href = `/bagpage?user=${encodeURIComponent(userName)}`;
    };

    return (
        <div className="friends-lookup-container" ref={dropdownRef}>
            <HamburgerMenu />
            <h1>find friends</h1>
            <div className="input-dropdown-container">
                <input
                    type="text"
                    value={searchInput}
                    onChange={handleInputChange}
                    placeholder="Search friend by username"
                    className="search-input"
                />
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((friend, index) => (
                            <li key={index} onClick={() => redirectToFriendBagPage(friend.UserName)}
                                className="suggestion-item">
                                {friend.UserName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default FriendSearchPage;
