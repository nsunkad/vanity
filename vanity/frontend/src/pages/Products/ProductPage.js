import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faTag } from '@fortawesome/free-solid-svg-icons';
import './ProductPage.css';

function ProductPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('productId');
    const productName = queryParams.get('product');

    const [productInfo, setProductInfo] = useState({
        productName: '',
        brandName: '',
        price: '',
        likeCount: '',
        avgRating: '',
        totalNumReviews: '',
        isPopular: false,
        usersAlsoBagged: [],
        reviews: []
    });

    useEffect(() => {
        console.log('Product ID:', productId);
        fetch(`http://localhost:8000/product-info?product_id=${productId}`)
            .then(response => response.json())
            .then(data => {
                const usersAlsoBaggedArray = Object.values(data.usersAlsoBagged); // Convert object to array
                setProductInfo({
                    productName: data.productName,
                    brandName: data.brandName,
                    price: data.price,
                    likeCount: data.likeCount,
                    avgRating: data.avgRating,
                    totalNumReviews: data.totalNumReviews,
                    isPopular: data.isPopular,
                    usersAlsoBagged: usersAlsoBaggedArray, // Use the array for mapping later
                    reviews: data.reviews
                });
            })
            .catch(error => console.error('Failed to fetch product info:', error));
    }, [productId]);

    return (
        <div className="product-page">
            <h1>{productInfo.productName || productName}</h1>
            <div className="brand-name">{productInfo.brandName}</div>
            {productInfo.isPopular && <p className="popular-product">This is a popular product!</p>}
            <div>
                <span className="price"><FontAwesomeIcon icon={faTag} /> Price: {productInfo.price}</span>
                <span className="likes"><FontAwesomeIcon icon={faHeart} /> Likes: {productInfo.likeCount}</span>
                <span className="rating"><FontAwesomeIcon icon={faStar} /> Rating: {productInfo.avgRating} ({productInfo.totalNumReviews} reviews)</span>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>rating</th>
                    </tr>
                </thead>
                <tbody>
                    {productInfo.usersAlsoBagged.map((prod, index) => (
                        <tr key={index}>
                            <td>{prod.productName}</td>
                            <td>{prod.avgRating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <button className="add-to-bag-button">Add to my bag</button>
        </div>
    );
}

export default ProductPage;
