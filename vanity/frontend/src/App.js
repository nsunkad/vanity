import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import WelcomePage from './pages/Welcome/WelcomePage';
import LoginPage from './pages/LogIn/LogInPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import MyBagPage from './pages/MyBag/MyBagPage';
import FriendSearchPage from './pages/Friends/FriendSearchPage';
import FriendResults from './pages/Friends/FriendResults';
import FriendBagPage from './pages/Friends/FriendBagPage';
import ProductSearchPage from './pages/Products/ProductSearchPage';
import ProductResults from './pages/Products/ProductResults';
import ProductPage from './pages/Products/ProductPage'; // Make sure to import the new ProductPage
import UpdateProfilePage from './pages/UpdateProfile/UpdateProfile';
import ProductReviews from './pages/ProductReviews/ProductReviews';

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
          <Route path="/bagpage/:UserName" element={<FriendBagPage />} />
          <Route path="/productsearch" element={<ProductSearchPage />} />
          <Route path="/productresults" element={<ProductResults />} />
          <Route path="/productpage" element={<ProductPage />} /> {/* New route for ProductPage */}
          <Route path="/updateprofile" element={<UpdateProfilePage />} />
          <Route path="/productreviews" element={<ProductReviews />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
