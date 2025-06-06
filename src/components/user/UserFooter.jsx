// src/components/UserFooter.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from 'react-icons/fa';

function UserFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">SparkleWash</h3>
            <p className="mb-4">
              Premium car wash services you can trust. Book anytime, anywhere.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-white transition">
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="hover:text-white">Services</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link to="/locations" className="hover:text-white">Locations</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Contact Us</h4>
            <address className="not-italic space-y-2 text-sm">
              <p>123 Sparkle St, Nairobi, KE</p>
              <p><a href="tel:+1234567890" className="hover:text-white">+254 123 456 789</a></p>
              <p><a href="mailto:info@sparklewash.com" className="hover:text-white">info@sparklewash.com</a></p>
            </address>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Newsletter</h4>
            <p className="text-sm mb-4">Get the latest offers and news straight to your inbox.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-l-md text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 mt-12" />

        {/* Bottom Bar */}
        <div className="text-center mt-6 text-sm text-gray-500">
          &copy; {currentYear} SparkleWash. All rights reserved. |
          <Link to="/privacy" className="hover:text-white mx-1">Privacy</Link> |
          <Link to="/terms" className="hover:text-white mx-1">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

export default UserFooter;
