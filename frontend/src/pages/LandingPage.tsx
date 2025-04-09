import React from 'react';
import backGroundImage from '../assets/background_image.jpg'
import { useNavigate } from 'react-router-dom';
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const LandingPage: React.FC = () => {
  const greeting = getGreeting();
  const navigate = useNavigate();
  return (
    <div style={{
        backgroundImage: `url(${backGroundImage})`,
      }}
      className="min-h-screen  bg-cover flex items-center justify-center px-6 text-left"
    >
      <div className="max-w-3xl ">
        <h1 className="text-4xl text-left sm:text-5xl font-bold text-gray-800 mb-4">
          {greeting} 👋
        </h1>
        <h2 className="text-2xl sm:text-3xl text-gray-700 font-semibold mb-6">
          Welcome to PropertyFinder
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          A modern web application for searching properties based on budget and payment preferences.
          <br />
          Search easily by choosing either a one-time investment or monthly payment option.
          <br />
          Our goal is to make your property search smooth, smart, and hassle-free.
          <br />
          <span className="mt-2 block">More features coming soon 🚀</span>
        </p>
        <button
          onClick={() => navigate('/explore')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Explore Properties
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
