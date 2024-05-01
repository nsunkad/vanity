import React, { useEffect, useState } from 'react';
import { MyBagButton } from '../../components/general/Buttons.js';
import './FriendResults.css';
import { useLocation, useNavigate } from 'react-router-dom';
import HamburgerMenu from '../../components/general/HamburgerMenu.js';

function FriendResults() {
    const { state } = useLocation();
    const initialResults = state ? state.results : [];
    const navigate = useNavigate();
    const [results, setResults] = useState(initialResults); // Initialize state with results passed from previous page if available

    useEffect(() => {
        // Only fetch if there are no results passed via state
        if (!results.length) {
            fetch('http://localhost:8000/lookup-friends')
                .then(response => response.json())
                .then(data => setResults(data))
                .catch(error => console.error('Error:', error));
        }
    }, [results.length]); // Dependency on results.length to avoid unnecessary fetches

    console.log(results.length);

    return (
      <div className="results-container">
        <HamburgerMenu />
        <h1>friend search results</h1>
        <p>click on a friend’s bag to view their bag items!</p>
        <table>
          <thead>
            <tr>
              <th>username</th>
              <th># bag items</th>
              <th>similarity level</th>
              <th>bag</th>
            </tr>
          </thead>
          <tbody>
            {results.map((friend, index) => (
              <tr key={index}>
                <td>{friend.UserName}</td>
                <td>{friend.NumProductsInBag}</td>
                <td>{friend['Similarity Rating']}</td>
                <td onClick={() => navigate(`/bagpage/${encodeURIComponent(friend.UserName)}`)}> {/* Change this line */}
                  <MyBagButton />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

export default FriendResults;