import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import carWashImage from '../../assets/image/carwash1.jpg';
import { FaCar, FaCouch, FaCarSide } from 'react-icons/fa'; // Custom icons for exterior, interior, full
import { motion } from 'framer-motion';

function LandingPage() {
  const { user } = useAuth();

  // Redirect logged-in users
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" />;
  if (user?.role === 'USER') return <Navigate to="/user/dashboard" />;

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-[#ffe31a] flex flex-col">
      
      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-6 py-28 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black bg-opacity-80 rounded-xl shadow-xl"
          style={{ backgroundImage: `url(${carWashImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <motion.div
          className="relative max-w-4xl text-center z-10 px-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            SparkleWash
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
            Transform your car with our fast, affordable, and eco-friendly car wash services — tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Link
              to="/login"
              className="bg-[#ffe31a] text-gray-900 font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-yellow-400 transition"
              aria-label="Login to your account"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border-2 border-[#ffe31a] text-[#ffe31a] font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-[#ffe31a] hover:text-gray-900 transition"
              aria-label="Register a new account"
            >
              Register
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Services Section */}
      <section className="bg-gray-800 py-20 px-6">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-4xl font-bold mb-14 tracking-wide">
            Our Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Exterior Only */}
            <motion.div
              className="bg-gray-700 rounded-xl p-10 shadow-lg cursor-default hover:shadow-[#ffe31a]/70 transition transform hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <FaCar className="text-[#ffe31a] text-6xl mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold mb-4">Exterior Only</h3>
              <p className="text-gray-300 leading-relaxed">
                Give your car a brilliant shine with our specialized exterior wash, removing dirt, grime, and streaks for a spotless finish.
              </p>
            </motion.div>

            {/* Interior Only */}
            <motion.div
              className="bg-gray-700 rounded-xl p-10 shadow-lg cursor-default hover:shadow-[#ffe31a]/70 transition transform hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <FaCouch className="text-[#ffe31a] text-6xl mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold mb-4">Interior Only</h3>
              <p className="text-gray-300 leading-relaxed">
                Freshen up your vehicle’s interior with a thorough cleaning of seats, carpets, dashboard, and all nooks and crannies.
              </p>
            </motion.div>

            {/* Full Exterior + Interior */}
            <motion.div
              className="bg-gray-700 rounded-xl p-10 shadow-lg cursor-default hover:shadow-[#ffe31a]/70 transition transform hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <FaCarSide className="text-[#ffe31a] text-6xl mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold mb-4">Full Exterior & Interior</h3>
              <p className="text-gray-300 leading-relaxed">
                Get the ultimate clean with our comprehensive full-package service — inside and out, leaving your car spotless and refreshed.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <footer className="bg-gradient-to-r from-[#ffe31a] to-yellow-400 text-gray-900 py-16 px-6 text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Ready to Make Your Car Shine?
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Book your appointment today and experience the SparkleWash difference.
          </p>
          <Link
            to="/user/booking"
            className="inline-block bg-gray-900 text-[#ffe31a] font-bold px-12 py-4 rounded-full shadow-lg hover:bg-gray-800 hover:text-yellow-300 transition transform hover:scale-105"
            aria-label="Book a car wash"
          >
            Book a Wash
          </Link>
        </motion.div>
      </footer>
    </div>
  );
}

export default LandingPage;
