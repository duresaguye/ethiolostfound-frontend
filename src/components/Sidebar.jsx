// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 bg-gray-900 mt-36 text-white z-50 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
      <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl">
          <FaTimes />
        </button>
        <Link to="/" className="text-white text-xl font-semibold" onClick={onClose}>Home</Link>
        <Link to="/post" className="text-white text-xl font-semibold" onClick={onClose}>Post Item</Link>
        <Link to="/profile" className="text-white text-xl font-semibold" onClick={onClose}>Profile</Link>
        <Link to="/about" className="text-white text-xl font-semibold" onClick={onClose}>About</Link>
      </div>
    </div>
  );
};

export default Sidebar;
