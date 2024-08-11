import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const Profile = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const { isAuthenticated, logout, accessToken, refreshToken } = useAuth();

  const refreshAccessToken = async () => {
    const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: localStorage.getItem('refresh_token') }),
    });

    if (refreshResponse.ok) {
      const { access } = await refreshResponse.json();
      localStorage.setItem('access_token', access);
    } else if (refreshResponse.status === 401) {
      // Handle unauthorized error
      console.error('Refresh token is invalid or expired');
      logout(); // Log out the user 
    } else {
      console.error('Failed to refresh access token');
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    let token = accessToken;
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      token = await refreshAccessToken();
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
    }

    return response;
  };

  // Function to fetch items related to the user
  const fetchItems = useCallback(async () => {
    try {
      const response = await fetchWithAuth('http://127.0.0.1:8000/api/items/profile/items/');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [accessToken]);

  // Function to fetch user profile
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetchWithAuth('http://127.0.0.1:8000/api/items/profile/update/');
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      setUser(data);
      setProfilePhoto(data.photo ? `http://127.0.0.1:8000${data.photo}` : null);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
      fetchUser();
    }
  }, [fetchItems, fetchUser, isAuthenticated]);

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);

      try {
        const response = await fetchWithAuth('http://127.0.0.1:8000/api/items/profile/update/', {
          method: 'PATCH',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload photo');
        }

        const data = await response.json();
        if (data.photo) {
          setProfilePhoto(`http://127.0.0.1:8000${data.photo}`);
        } else {
          console.error('Photo upload failed, no photo URL returned');
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetchWithAuth(`http://127.0.0.1:8000/api/items/${itemId}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Posted Items</h2>
            {items.length === 0 ? (
              <p>No items to display</p>
            ) : (
              <ul className="space-y-2 lg:flex flex-row">
                {items.map(item => (
                  <li key={item.id} className="p-4 rounded-lg shadow-md">
                    {item.image && (
                      <img className="rounded-t-lg w-40 h-40 object-cover" src={item.image} alt={item.title} />
                    )}
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p>{item.description}</p>
                    <p className="text-sm text-gray-400">Location: {item.location}</p>
                   <p className="mb-2"><strong>Date:</strong> {new Date(item.date_posted).toLocaleDateString()}</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 px-3 py-1 rounded-md text-white font-semibold hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case 'about':
        return (
          <div className="mt-2">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p>{user?.bio || 'No bio available'}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row">
      <aside className="w-20 lg:w-60 h-full bg-gray-800 lg:p-4 flex flex-col sticky top-0 left-0">
        <div className="flex flex-col items-center lg:mt-0">
          <input
            type="file"
            onChange={handleProfilePhotoChange}
            className="hidden"
            id="profile-photo-upload"
          />
          <label htmlFor="profile-photo-upload" className="cursor-pointer">
            <div className="w-20 h-20 lg:w-32 lg:h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-600">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-600 text-gray-400">
                  Upload Photo
                </div>
              )}
            </div>
          </label>
          <h1 className="text-base lg:text-xl font-bold text-center mt-4">{user ? user.name : 'Loading...'}</h1>
          <button
            onClick={() => document.getElementById('profile-photo-upload').click()}
            className="bg-blue-500 text-white px-2 py-2 rounded-lg mt-2 mb-2"
          >
            Change Photo
          </button>
        </div>
        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-2 lg:px-4 py-2 text-sm lg:text-lg font-semibold ${activeTab === 'posts' ? 'bg-gray-700' : 'text-gray-400'} rounded-md`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-2 lg:px-4 py-2 text-sm lg:text-lg font-semibold ${activeTab === 'about' ? 'bg-gray-700' : 'text-gray-400'} rounded-md`}
          >
            About
          </button>
          <button
            onClick={logout}
            className="px-2 lg:px-4 py-2 text-sm lg:text-lg font-semibold bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 ml-20 lg:ml-20 p-4 lg:mt-0">
        <div className="rounded-lg shadow-lg">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Profile;