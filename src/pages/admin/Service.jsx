import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiClock, FiSearch } from 'react-icons/fi';

function WashService() {
  const [services, setServices] = useState([]); // Ensure initial state is an array
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 0
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Configure axios to send cookies
  axios.defaults.withCredentials = true;

  // Add response interceptor to handle 401 errors
  axios.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status === 401) {
        try {
          await axios.post('/api/auth/refresh');
          return axios(error.config);
        } catch (refreshError) {
          navigate('/login');
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  // Fetch services from backend
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/services');
      // Ensure we're setting an array
      setServices(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
      setServices([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services based on search term - now safely handles non-array cases
  const filteredServices = Array.isArray(services) 
    ? services.filter(service =>
        service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // ... rest of your component code remains the same ...

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {isLoading ? (
        <div className="text-center py-8">Loading services...</div>
      ) : (
        <>
          {/* Your existing JSX here */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Service Name</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">
                    <FiDollarSign className="inline mr-1" /> Price
                  </th>
                  <th className="py-3 px-4 text-left">
                    <FiClock className="inline mr-1" /> Duration
                  </th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">{service.name}</td>
                      <td className="py-4 px-4">{service.description}</td>
                      <td className="py-4 px-4">${service.price?.toFixed(2)}</td>
                      <td className="py-4 px-4">{service.duration} mins</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                      {services.length === 0 ? 'No services available' : 'No matching services found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default WashService;