import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import './ProductReviews.css';

function ProductReviews() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('productId');

    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Product ID:', productId);

        if (productId) {
            fetch(`http://localhost:8000/get-product-reviews?q=${productId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setReviews(data);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch product reviews:', err);
                setError('Failed to fetch product reviews');
                setIsLoading(false);
            });
        }
    }, [productId]);

    return (
        <div className="productreview-page">
            <HamburgerMenu />
            <div className="reviews-container">
                {isLoading ? (
                    <p>Loading reviews...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="review">
                            <h3>{review.Title}</h3>
                            <p>{review.Text}</p>
                            <div>Rating: {review.Rating} stars</div>
                            <div>Date: {new Date(review.Date).toLocaleDateString()}</div>
                        </div>
                    ))
                ) : (
                    <p>No reviews found for this product.</p>
                )}
            </div>
        </div>
    );
}

export default ProductReviews;
