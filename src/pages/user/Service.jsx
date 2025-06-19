import React, { useState, useEffect } from 'react';
import { FaCar, FaTools } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

function Service() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/services', { withCredentials: true });
        setServices(response.data || []);
      } catch (err) {
        console.error('Failed to load services:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load services');
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaTools className="mr-2 text-blue-600 text-lg" /> Our Services
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>
      )}

      {/* Services Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center mb-4">
                  <FaCar className="text-blue-600 text-2xl mr-2" />
                  <h2 className="text-lg font-semibold text-gray-700">{service.name}</h2>
                </div>
                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Price:</span> ${service.price}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Duration:</span> {service.duration} minutes
                </p>
                {user ? (
                  <Link
                    to={`/user/booking?serviceId=${service.id}`}
                    className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                    aria-label={`Book ${service.name}`}
                    title={`Book ${service.name} service`}
                  >
                    Book Now
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition text-sm font-medium"
                    aria-label="Login to book service"
                  >
                    Login to Book
                  </Link>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 col-span-full">No services available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Service;