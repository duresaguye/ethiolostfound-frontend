import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useItems } from './ItemsContext';
import { FaSpinner } from 'react-icons/fa';

const Home = () => {
  const { items, loading, error } = useItems();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleFilterChange = (status) => {
    setFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  const filteredItems = items
    .filter(item => 
      (filter === 'all' || item.item_type === filter) &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="text-4xl animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <section className="text-center mb-6 p-6">
        <h1 className="text-5xl font-extrabold mb-4 ">
          <span className="text-green-600">Welcome to </span>
          <span className="text-yellow-600">Ethiolost</span>
           <span className="text-red-600"> & Found!</span>
        </h1>
        <p className="text-xl mb-6">
          Discover a world of lost and found treasures! Whether you are searching for a lost item or want to help reunite others with their belongings, you are in the right place. Sign up or log in to start posting, claiming, or browsing items that matter to you.
          Let’s make sure <span className="font-bold">nothing goes missing!</span> 
        </p>
      </section>

      <section className="flex justify-center items-center mb-3">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 mr-2 bg-gray-800 rounded-lg focus:outline-none text-white text-left"
        />
      </section>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 mx-2 rounded-lg ${filter === 'all' ? 'bg-indigo-600' : 'bg-gray-800'} text-white`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange('lost')}
          className={`px-4 py-2 mx-2 rounded-lg ${filter === 'lost' ? 'bg-indigo-600' : 'bg-gray-800'} text-white`}
        >
          Lost
        </button>
        <button
          onClick={() => handleFilterChange('found')}
          className={`px-4 py-2 mx-2 rounded-lg ${filter === 'found' ? 'bg-indigo-600' : 'bg-gray-800'} text-white`}
        >
          Found
        </button>
      </div>

      <h2 className="text-4xl font-bold mb-2 text-center">Lost and Found Items</h2>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="w-1 h-12 bg-gray-300 mr-4"></div>
          <h2 className="text-2xl font-semibold text-gray-200">
            Recently Posted
          </h2>
        </div>
        <div className="border-b-2 border-gray-300"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.length > 0 ? (
          currentItems.map(item => (
            <Link to={`/item/${item.id}`} key={item.id}>
              <div className="relative max-w-sm text-white border border-gray-200 rounded-lg shadow transition-transform duration-300 hover:scale-105 hover:border-blue-500">
                {item.image && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="object-cover w-full h-full" 
                    />
                  </div>
                )}
                <div className="p-5">
                  <h5 className="mb-2 text-2xl font-bold text-green-500">
                    {item.title}
                  </h5>
                  <Link 
                    to={`/item/${item.id}`}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition duration-300"
                  >
                    See More
                    <svg className="w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600">No items found.</p>
        )}
      </div>

      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-indigo-600' : 'bg-gray-800'} text-white`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;