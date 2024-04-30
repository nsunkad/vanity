import React, { useEffect, useState } from 'react';
import { MyBagButton } from '../../components/general/Buttons.js'; // Assuming you have a button suitable for product page navigation
import './ProductResults.css'; // Assuming CSS styles similar to FriendResults.css
import { useLocation } from 'react-router-dom';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';

function ProductResults() {
    const { state } = useLocation();
    const initialResults = state ? state.results : [];
    const [results, setResults] = useState(initialResults); // Initialize state with results passed from previous page if available

    useEffect(() => {
        // Only fetch if there are no results passed via state
        if (!results.length) {
            fetch('http://localhost:8000/lookup-products')
                .then(response => response.json())
                .then(data => setResults(data))
                .catch(error => console.error('Error:', error));
        }
    }, [results.length]); // Dependency on results.length to avoid unnecessary fetches

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
              <td>{product.Name}</td>
              <td>{product.Brand}</td>
              <td onClick={() => window.location.href = `/productpage?product=${encodeURIComponent(product.Name)}`}>
                <MyBagButton /> {/* Assuming you want a button, replace with an appropriate icon if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductResults;
