import React, { useState } from 'react';
import './ProductSearchPage.css';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import { useUser } from '../../context/UserContext.js';
import { Search } from '../../components/general/Buttons.js';
import { useNavigate } from 'react-router-dom';

function ProductSearchPage() {
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
            fetch(`http://localhost:8000/lookup-products?search=${searchInput}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setErrorMessage(data.error);
                } else if (data.length === 0) {
                    setErrorMessage("No results found. Double check your spelling and try again :)");
                } else {
                    navigate('/productresults', { state: { results: data } });
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
            <h1>find products</h1>
            <div className="search-wrapper"> 
                <input
                    type="text"
                    value={searchInput}
                    onChange={handleInputChange}
                    placeholder="search by product name"
                    className="search-input"
                />
                <Search onClick={fetchSuggestions} />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default ProductSearchPage;