import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

interface Property {
  name: string;
  location: string;
  totalSqftAvailable: number;
  pricePerSqft: number;
  propertyType: 'normal' | 'premium' | 'luxury';
  totalPrice?: number;
  threeYear?: number;
  fiveYear?: number;
  sevenYear?: number;
}

const ResultsPage = () => {
  const location = useLocation();
  const { type, propertyType } = location.state || {};
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getBudgetByPropertyType = (type: string): number => {
    switch (type) {
      case 'normal':
        return 50000;
      case 'premium':
        return 500000;
      case 'luxury':
        return 5000000;
      default:
        return 50000;
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const budget = getBudgetByPropertyType(propertyType);
        const res = await axios.post('https://property-search-agent.onrender.com/search', {
          type,
          budget
        });

        const responseData = Array.isArray(res.data) ? res.data : res.data.data || [];

        const filtered = responseData.filter(
          (property: any) => property.propertyType === propertyType
        );

        setProperties(filtered);
      } catch (err) {
        setError('Failed to load properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [propertyType]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Showing {propertyType} Properties ({type})
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-blue-600 text-center mb-4">Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 p-4">
        {properties.map((property, idx) => (
          <div key={idx} className="bg-white shadow-lg p-5 rounded-lg border">
            <h3 className="text-xl font-bold mb-1">{property.name}</h3>
            <p className="text-gray-500 mb-2">{property.location}</p>
            <p>Total Area: {property.totalSqftAvailable} sq.ft</p>
            <p>Price per sq.ft: {formatCurrency(property.pricePerSqft)}</p>
            <p>Total Price: {formatCurrency(property.totalPrice || 0)}</p>

            {type === 'monthly' && (
              <div className="mt-2">
                <p>3 Year EMI: {formatCurrency(property.threeYear || 0)}</p>
                <p>5 Year EMI: {formatCurrency(property.fiveYear || 0)}</p>
                <p>7 Year EMI: {formatCurrency(property.sevenYear || 0)}</p>
              </div>
            )}

            <button className="mt-4 px-4 cursor-pointer py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              Query Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
