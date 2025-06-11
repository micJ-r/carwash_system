import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import carWashImage from '../../assets/image/carwash1.jpg';
import { FaCar, FaPumpSoap, FaWater, FaRegSmileBeam } from 'react-icons/fa';

function LandingPage() {
  const { user } = useAuth();

  // Redirect logged-in users to their dashboards
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" />;
  if (user?.role === 'USER') return <Navigate to="/user/dashboard" />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div
          className="relative w-full h-[600px] rounded-xl shadow-xl overflow-hidden flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${carWashImage})` }}
        >
          <div className="relative z-10 text-center text-white px-6 max-w-xl">
            <h1 className="text-4xl font-bold mb-4">SparkleWash - Premium Car Care</h1>
            <p className="text-lg mb-6">
              Book your car wash appointments in seconds. Professional. Affordable. Reliable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-50"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Services Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-10">
            Our Services
          </h2>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-100 rounded-lg shadow p-6 text-center hover:shadow-lg transition">
              <FaCar className="text-blue-600 text-4xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Exterior Wash</h3>
              <p className="text-gray-600">Shine up your car with our detailed exterior cleaning service.</p>
            </div>

            <div className="bg-gray-100 rounded-lg shadow p-6 text-center hover:shadow-lg transition">
              <FaPumpSoap className="text-blue-600 text-4xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Interior Detailing</h3>
              <p className="text-gray-600">We deep clean your seats, dashboard, and carpets for a fresh interior.</p>
            </div>

            <div className="bg-gray-100 rounded-lg shadow p-6 text-center hover:shadow-lg transition">
              <FaWater className="text-blue-600 text-4xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Full Wash Package</h3>
              <p className="text-gray-600">Combine both interior and exterior services for maximum value.</p>
            </div>

            <div className="bg-gray-100 rounded-lg shadow p-6 text-center hover:shadow-lg transition">
              <FaRegSmileBeam className="text-blue-600 text-4xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
              <p className="text-gray-600">Friendly and fast support for all your booking needs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
