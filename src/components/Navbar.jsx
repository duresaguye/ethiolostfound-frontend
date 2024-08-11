import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
  <nav  
 className="container mx-auto flex flex-col md:flex-row justify-between items-center py-4 sticky top-0 z-50 bg-gray-900 shadow-md">
     <div className="flex items-center space-x-2 md:space-x-4">
            <Link to="/" className="text-xl md:text-2xl font-bold flex items-center space-x-1">
              <span className="text-green-500">E</span>
              <span className="text-yellow-500">t</span>
              <span className="text-red-500">h</span>
              <span className="text-blue-500">i</span>
              <span className="text-green-500">o</span>
              <span className="text-yellow-500 ml-1">L</span>
              <span className="text-red-500">o</span>
              <span className="text-blue-500">s</span>
              <span className="text-green-500">t</span>
              <span className="text-yellow-500 ml-1">&</span>
              <span className="text-red-500 ml-1">F</span>
              <span className="text-blue-500">o</span>
              <span className="text-green-500">u</span>
              <span className="text-yellow-500">n</span>
              <span className="text-red-500">d</span>
            </Link>
          </div>
          <div className="hidden md:flex flex-grow justify-between items-center ml-44 space-x-10 text-center text-lg">
            <div className="flex space-x-10">
              <Link to="/" className="inline-block hover:underline">Home</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/post" className="inline-block hover:underline">Post Item</Link>
                  <Link to="/profile" className="inline-block hover:underline">Profile</Link>
                </>
              ) : (
                <>
                  
                  <Link to="/login" className="inline-block hover:underline">Signup/login</Link>
                </>
              )}

              {isAuthenticated && (
              <button onClick={logout} className="inline-block hover:underline">Logout</button>
            )}
            </div>
            
          </div>
          <button className="md:hidden flex items-center relative z-50" onClick={toggleMobileMenu}>
            <div className={`w-6 h-6 flex flex-col justify-center items-center relative transition-transform duration-300 ${isMobileMenuOpen ? 'open' : ''}`}>
              <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white mt-1 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white mt-1 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
            </div>
          </button>
    </nav>
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-75 z-40 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-white text-xl font-semibold" onClick={toggleMobileMenu}>Home</Link>
                <Link to="/post" className="text-white text-xl font-semibold" onClick={toggleMobileMenu}>Post Item</Link>
                <Link to="/profile" className="text-white text-xl font-semibold" onClick={toggleMobileMenu}>Profile</Link>
                <button onClick={() => { logout(); toggleMobileMenu(); }} className="text-white text-xl font-semibold">Logout</button>
              </>
            ) : (
              <>
               <Link to="/" className="text-white text-xl font-semibold">Home</Link>
                <Link to="/login" className="text-white text-xl font-semibold" onClick={toggleMobileMenu}>Signup/login</Link>
              </>
            )}
          </div>
        </div>
    </>
  

  );
};

export default Navbar;