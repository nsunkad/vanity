import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faTag, faPlus } from '@fortawesome/free-solid-svg-icons';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';
import { useUser } from '../../context/UserContext.js';
import './ProductPage.css';

function ProductPage() {
    const { user } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
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
        fetch(`http://localhost:8000/product-info?product_id=${productId}`)
            .then(response => response.json())
            .then(data => {
                const usersAlsoBaggedArray = Object.values(data.usersAlsoBagged);
                setProductInfo({
                    productName: data.productName,
                    brandName: data.brandName,
                    price: data.price,
                    likeCount: data.likeCount,
                    avgRating: data.avgRating,
                    totalNumReviews: data.totalNumReviews,
                    isPopular: data.isPopular,
                    usersAlsoBagged: usersAlsoBaggedArray,
                });
            })
            .catch(error => console.error('Failed to fetch product info:', error));

    }, [productId]);

    const handleAddToBag = () => {
        fetch('http://localhost:8000/create-bag-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.userId,
                productId: productId,
            }),
        })
        .then(response => {
            if (response.ok) {
                alert('Product added to bag successfully!');
            } else {
                throw new Error('Failed to add product to bag');
            }
        })
        .catch(error => {
            console.error('Error adding product to bag:', error);
        });
    };

    const navigateToReviews = () => {
        navigate(`/productreviews?productId=${productId}`);
    };

    return (
        <div className="product-page">
            <HamburgerMenu />
            <div className="product-outer">
                <div className="product-left">
                    <h1>{productInfo.productName || productName}</h1>
                    <div className="brand-name">{productInfo.brandName}</div>
                    <div className="product-attributes-smaller">
                        <span className="price"><FontAwesomeIcon icon={faTag} /> ${productInfo.price}</span>
                        <span className="likes"><FontAwesomeIcon icon={faHeart} /> {productInfo.likeCount}</span>
                        <span className="rating">
                            {[...Array(Math.ceil(productInfo.avgRating))].map((_, index) => (
                                <FontAwesomeIcon key={index} icon={faStar} />
                            ))} {productInfo.avgRating}
                        </span>
                    </div>
                    {productInfo.isPopular && <p className="popular-product">This is a popular product!</p>}
                    <button onClick={navigateToReviews}>Read Reviews</button>
                </div>
                <div className="product-right">
                    <div className="add-to-bag-outer" onClick={handleAddToBag}>
                        <div className="add-to-bag-inner">
                            <FontAwesomeIcon icon={faPlus} size="5x" />
                            <div className="button-text">add to my bag</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="product-table">
                <h2>Users who bagged this item also bagged</h2>
                <table>
                    <tbody>
                        {productInfo.usersAlsoBagged.slice(0, 5).map((prod, index) => (
                            <tr key={index}>
                                <td>{prod.productName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductPage;
