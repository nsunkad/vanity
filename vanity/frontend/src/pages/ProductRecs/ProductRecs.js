import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import './ProductRecs.css';

function ProductRecs() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('productId');

    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Product ID:', productId);

        if (productId) {
            fetch(`http://localhost:8000/generate-product-recommendations?q=${productId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setRecommendations(data);
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch product recommendations:', err);
                    setError('Failed to fetch product recommendations');
                    setIsLoading(false);
                });
        } else {
            setError('No product ID provided');
            setIsLoading(false);
        }
    }, [productId]);

    return (
        <div className="productrecs-page">
            <HamburgerMenu />
            <div>
                {isLoading ? (
                    <p>Loading recommendations...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <div>
                        <h2>Product Recommendations for {productId}</h2>
                        <ul>
                            {recommendations.map((recProductId, index) => (
                                <li key={index}>{recProductId}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductRecs;
