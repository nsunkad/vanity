import React, { useEffect, useState } from 'react';
import { MyBagButton } from '../../components/general/Buttons.js';
import './FriendResults.css';
import { useLocation } from 'react-router-dom';

function FriendResults() {
    const { state } = useLocation();
    const initialResults = state ? state.results : [];
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
      <h1>search results</h1>
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
              <td onClick={() => window.location.href = `/bagpage?user=${encodeURIComponent(friend.UserName)}`}>
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