import React from 'react';
import { useUser } from '../../context/UserContext.js'; // Ensure correct path to your UserContext
import './MyBagPage.css';

const MyBagPage = () => {
  const { user } = useUser(); // Access user from context

  // Handle situations where there is no user data (user not logged in or data not loaded)
  const firstName = user ? user.firstname : "User";

  return (
    <div className={"mybag-container"}>
      <div className={"mybag-header"}>
        <div className={"mybag-menuIcon"} />
        <h1 className={"mybag-name"}>{firstName}'s Bag</h1> {/* Dynamic user name */}
        <div className={"mybag-addIcon"} />
      </div>
      <div className={"mybag-bag"}>
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} className={"mybag-slot"}></div> // Corrected key to use index
        ))}
      </div>
    </div>
  );
};

export default MyBagPage;
