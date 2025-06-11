import React from 'react';
import { Link } from 'react-router-dom';
import { FaCarAlt } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

function Home() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to SparkleWash</h1>
          <p className="text-lg md:text-xl mb-6">
            Your car deserves the best — fast, affordable, and spotless washes.
          </p>
          <Link
            to="/user/services"
            className="inline-flex items-center bg-white text-blue-700 px-6 py-3 rounded-md font-medium shadow hover:bg-gray-100 transition"
          >
            Explore Services <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-blue-100 p-6 rounded-lg shadow">
            <FaCarAlt className="text-blue-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Premium Wash</h3>
            <p>Get a professional-level car wash anytime you need it.</p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg shadow">
            <img
              src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
              alt="Booking"
              className="w-12 h-12 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p>Book online with a few clicks — it's that simple.</p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg shadow">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png"
              alt="Support"
              className="w-12 h-12 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Support</h3>
            <p>Reach out to us 24/7 with any questions or needs.</p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-blue-700 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to shine?</h2>
        <Link
          to="/user/booking"
          className="bg-white text-blue-700 px-6 py-3 rounded-md shadow hover:bg-gray-100 transition"
        >
          Book a Wash
        </Link>
      </section>
    </div>
  );
}

export default Home;
