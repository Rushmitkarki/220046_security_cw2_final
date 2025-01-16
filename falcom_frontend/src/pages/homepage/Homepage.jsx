


import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import carRaceVideo from '../../assets/mp4/car_race.mp4';
import banner1 from '../../assets/images/banner1.png';
import banner2 from '../../assets/images/banner2.png';
import banner3 from '../../assets/images/banner3.png';
import banner4 from '../../assets/images/banner4.png';
import banner5 from '../../assets/images/banner5.png';

const HomePage = () => {
  const banners = [banner1, banner2, banner3, banner4, banner5];
  const bannerContainerRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    if (bannerContainerRef.current) {
      bannerContainerRef.current.scrollLeft = currentBannerIndex * bannerContainerRef.current.offsetWidth;
    }
  }, [currentBannerIndex]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-100" style={{ backgroundColor: 'hsl(0, 0%, 13%)' }}>
      {/* Navbar */}
      <nav className="bg-red-900 fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 hover:bg-red-800">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">WeWheels</Link>
          <div className="flex space-x-4">
            
            <Link to="/about" className="text-white hover:text-gray-300">About</Link>
            
          </div>
        </div>
      </nav>

      {/* Video Container */}
      <div className="container mx-auto mt-20 bg-transparent rounded-lg overflow-hidden shadow-2xl" style={{ maxWidth: '1280px' }}>
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted>
            <source src={carRaceVideo} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Discover Our Products Section */}
      <div className="container mx-auto mt-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-10 text-lime-500 animate-pulse">Discover Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['Tyres', 'Tubes', 'Lubricants', 'Accessories'].map((product, index) => (
            <div key={index} className="bg-neutral-800 p-8 rounded-lg shadow-md transition-all duration-300 hover:bg-red-800 hover:shadow-xl transform hover:-translate-y-1">
              <h3 className="text-2xl font-semibold mb-4">{product}</h3>
              <p className="text-gray-300">Experience top-quality {product.toLowerCase()} designed for optimal performance and durability. Our selection caters to all your automotive needs.</p>
            </div>
          ))}
        </div>
        
        <h2 className="text-4xl font-bold mt-20 mb-10 text-lime-500">Why Choose WeWheels?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['Quality Assurance', 'Expert Advice', 'Fast Shipping', 'Customer Satisfaction'].map((reason, index) => (
            <div key={index} className="bg-neutral-800 p-8 rounded-lg shadow-md transition-all duration-300 hover:bg-red-800 hover:shadow-xl transform hover:-translate-y-1">
              <h3 className="text-2xl font-semibold mb-4">{reason}</h3>
              <p className="text-gray-300">We prioritize {reason.toLowerCase()} to ensure you have the best possible experience with every purchase and interaction.</p>
            </div>
          ))}
        </div>
        
        <h2 className="text-4xl font-bold mt-20 mb-6 text-lime-500 animate-pulse">Join Our Community</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">Stay up-to-date with the latest in automotive trends, tips, and exclusive offers by joining our WeWheels community. Be part of a passionate group of automotive enthusiasts.</p>
        <Link to="/register">
          <button className="bg-neutral-600 font-bold text-white py-4 px-10 rounded-lg text-2xl transition-all duration-300 hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
            Join Us
          </button>
        </Link>
      </div>

      {/* Side Scrollable Container */}
      <div
        id="bannerContainer"
        ref={bannerContainerRef}
        className="overflow-hidden mt-20 bg-transparent rounded-lg w-full max-w-screen-lg shadow-2xl"
        style={{ height: '600px' }}
      >
        <div className="flex">
          {banners.map((banner, index) => (
            <img
              key={index}
              src={banner}
              alt={`Banner ${index + 1}`}
              className="inline-block w-full h-full object-cover transition-opacity duration-500"
              style={{
                display: index === currentBannerIndex ? 'inline-block' : 'none',
                opacity: index === currentBannerIndex ? 1 : 0
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-red-900 w-full mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">&copy; 2024 WeWheels. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;