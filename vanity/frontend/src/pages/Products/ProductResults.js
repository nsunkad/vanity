import React, { useEffect, useState } from 'react';
import './ProductResults.css'; // Assuming CSS styles similar to FriendResults.css
import { useLocation } from 'react-router-dom';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function ProductResults() {
    const { state } = useLocation();
    const initialResults = state ? state.results : [];
    const [results, setResults] = useState(initialResults);

    useEffect(() => {
        if (!results.length) {
            fetch('http://localhost:8000/lookup-products')
                .then(response => response.json())
                .then(data => setResults(data))
                .catch(error => console.error('Error:', error));
        }
    }, [results.length]);

    return (
        <div className="results-container">
            <HamburgerMenu />
            <h1>product search results</h1>
            <p>click on the icon to navigate to the product page!</p>
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>brand</th>
                        <th>view</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((product, index) => (
                        <tr key={index}>
                            <td>{product.ProductName}</td>
                            <td>{product.BrandName}</td>
                            <td onClick={() => window.location.href = `/productpage?product=${encodeURIComponent(product.ProductName)}&productId=${product.ProductId}`}>
                            <button className="icon-button">
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductResults;
