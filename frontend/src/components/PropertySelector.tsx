import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Property {
  _id: string;
  name: string;
  location: string;
  totalSqftAvailable: number;
  pricePerSqft: number;
  totalPrice: number;
  threeYear?: number;
  fiveYear?: number;
  sevenYear?: number;
}

const PropertySelector: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else if (hour < 22) setGreeting('Good Evening');
    else setGreeting('Good Night');
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const handleCardClick = async (amount: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/search', {
        type: 'monthly',
        budget: amount,
      });
      setProperties(response.data);
    } catch (err) {
      setError('Error searching for properties. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-8 text-center">
      <h1 className="text-3xl font-semibold mb-6">{greeting}! 👋</h1>

      <div className="flex flex-wrap justify-center gap-8 p-4">
        {[50000, 500000, 5000000].map((amount) => (
          <div
            key={amount}
            onClick={() => handleCardClick(amount)}
            className="w-64 h-40 bg-indigo-300 hover:bg-gradient-to-t from-indigo-300 via-indigo-400 to-indigo-500 transition-all duration-300 ease-in-out flex justify-center items-center rounded-xl shadow-md cursor-pointer"
          >
            <h2 className="text-lg font-bold text-black">
              Properties under ₹{amount.toLocaleString()}
            </h2>
          </div>
        ))}
      </div>
      {error && (
        <p className="text-red-600 text-center mb-4">
          {error}
        </p>
      )}

      {loading && (
        <p className="text-blue-600 text-center mb-4 animate-pulse">
          Loading properties...
        </p>
      )}
      <div className="flex justify-center items-center p-6 m-2 gap-6">
        {properties.map((property) => (
          <div
            key={property._id}
            className="bg-white w-70 m-2   text-left p-6 rounded-lg shadow transform transition duration-300 hover:scale-125"
          >
            <h3 className="text-xl font-semibold mb-1">{property.name}</h3>
            <p className="text-gray-600 mb-2">{property.location}</p>
            <p>Total Area: {property.totalSqftAvailable} sq.ft</p>
            <p>Price per sq.ft: {formatCurrency(property.pricePerSqft)}</p>
            <p>Total Price: {formatCurrency(property.totalPrice)}</p>
            <p>3 Year EMI: {formatCurrency(property.threeYear || 0)}</p>
            <p>5 Year EMI: {formatCurrency(property.fiveYear || 0)}</p>
            <p>7 Year EMI: {formatCurrency(property.sevenYear || 0)}</p>
            <button className="mt-2 text-blue-600 hover:underline">View Details</button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PropertySelector;
