// components/ItemDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/items/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch item');
        }
        const data = await response.json();
        setItem(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!item) return <p>Item not found</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto  border border-gray-200 rounded-lg shadow  ">
        
        {item.image && (
          <img className="rounded-t-lg w-full h-full object-cover" src={item.image} alt={item.title} />
        )}
        <div className="p-5">
          <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
          <p className="mb-4">{item.description}</p>
          <p className="mb-2"><strong>Location:</strong> {item.location}</p>
         <p className="mb-2"><strong>Date:</strong> {new Date(item.date_posted).toLocaleDateString()}</p>
          <p><strong>Contact:</strong> {item.contact}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
