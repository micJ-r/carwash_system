import React, { useState } from 'react';
import { FiUser, FiMail, FiMessageSquare, FiAlertCircle, FiPhone, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../../api/axios';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await axios.post('/contact', formData, { withCredentials: true });
      toast.success('Message sent successfully!');
      setSuccess('Your message has been sent. We’ll get back to you soon!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to send message';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-md rounded-lg max-w-3xl w-full p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center flex items-center justify-center">
          <FiMessageSquare className="mr-2" /> Contact Us
        </h2>
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <FiAlertCircle className="mr-2" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
            <FiCheckCircle className="mr-2" /> {success}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6 text-gray-700">
            <p className="text-lg">Have questions or need help? Reach out to us!</p>
            <div className="flex items-start">
              <FiPhone className="text-blue-600 text-xl mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start">
              <FiMail className="text-blue-600 text-xl mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Email</h3>
                <p>support@sparklewash.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <FiMapPin className="text-blue-600 text-xl mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Address</h3>
                <p>123 Sparkle St., Clean City, CA 90000</p>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                  aria-label="Name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  aria-label="Email"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message here..."
                aria-label="Message"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Send message"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;