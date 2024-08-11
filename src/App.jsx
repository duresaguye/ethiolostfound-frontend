import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import PostItem from './components/PostItem';
import Signup from './components/Signup';
import UserProfile from './components/Profile';
import Login from './components/Login'; 
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import ItemDetail from './components/ItemDetail';
import Footer from './components/Footer'

const App = () => {
 
  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen">
         <Navbar />
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<PrivateRoute element={<PostItem />} />} />
            <Route path="/profile" element={<PrivateRoute element={<UserProfile />} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/item/:id" element={<PrivateRoute element={<ItemDetail />} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;