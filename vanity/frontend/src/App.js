import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import WelcomePage from './pages/Welcome/WelcomePage';
import LoginPage from './pages/LogIn/LogInPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import MyBagPage from './pages/MyBag/MyBagPage';
import FriendSearchPage from './pages/Friends/FriendSearchPage';
import FriendResults from './pages/Friends/FriendResults';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} exact />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/mybag" element={<MyBagPage />} />
          <Route path="/friends" element={<FriendSearchPage />} />
          <Route path="/friendresults" element={<FriendResults />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;