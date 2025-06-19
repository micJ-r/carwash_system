import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiHeadphones } from 'react-icons/fi'; // Feather Icons
import { FaCarAlt } from 'react-icons/fa'; // Font Awesome Icons
import { motion } from 'framer-motion'; // For animations

function Home() {
  // Animation variants for fade-in effects
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white py-24 px-6 flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1614160933205-88bb875cc71b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <motion.div
          className="relative max-w-4xl mx-auto text-center z-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            SparkleWash: Shine Bright
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto">
            Transform your car with our fast, affordable, and eco-friendly car wash services.
          </p>
          <Link
            to="/user/services"
            className="inline-flex items-center bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
            aria-label="Explore car wash services"
          >
            Explore Services <FiArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Why Choose SparkleWash?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <FaCarAlt className="text-blue-600 text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Premium Wash</h3>
              <p className="text-gray-600">
                Experience a professional-grade clean with our advanced washing techniques.
              </p>
            </motion.div>
            <motion.div
              className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <FiCalendar className="text-blue-600 text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Easy Booking</h3>
              <p className="text-gray-600">
                Schedule your wash in seconds with our user-friendly online platform.
              </p>
            </motion.div>
            <motion.div
              className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <FiHeadphones className="text-blue-600 text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our team is here to assist you anytime, day or night.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-100">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 italic mb-4">
                "SparkleWash made my car look brand new! The booking process was a breeze."
              </p>
              <p className="font-semibold text-gray-800">— Sarah M.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 italic mb-4">
                "Amazing service and friendly staff. I’ll be back every month!"
              </p>
              <p className="font-semibold text-gray-800">— John D.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 px-6 text-center">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make Your Car Shine?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Book your appointment today and experience the SparkleWash difference.
          </p>
          <Link
            to="/user/booking"
            className="inline-flex items-center bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
            aria-label="Book a car wash"
          >
            Book a Wash <FiArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;