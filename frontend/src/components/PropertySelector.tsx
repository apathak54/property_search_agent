import React, { useEffect, useState } from 'react';

const PropertySelector: React.FC = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else if (hour < 20) setGreeting('Good Evening');
    else setGreeting('Good Night');
  }, []);

  const handleCardClick = async (amount: number) => {
    try {
      const res = await fetch('/api/search-properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: amount }),
      });
      const data = await res.json();
      console.log(`Results for ₹${amount}:`, data);
      // You can do something like setResults(data) or navigate
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="w-full px-4 py-8 text-center">
      <h1 className="text-3xl font-semibold mb-6">{greeting}! 👋</h1>

      <div className="flex flex-wrap justify-center gap-6">
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
    </div>
  );
};

export default PropertySelector;
