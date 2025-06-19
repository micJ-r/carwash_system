import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiDollarSign,
  FiClock,
  FiSearch,
  FiX,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from 'react-icons/fi';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../../services/serviceService';
import axiosInstance from '../../api/axios';

function WashService() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    serviceType: '',
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [newTimeSlot, setNewTimeSlot] = useState({ date: '', startTime: '', endTime: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;
  const navigate = useNavigate();

  // Fetch services
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await getServices();
      setServices(data);
      setError('');
    } catch (err) {
      handleError(err, 'Failed to load services');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch time slots for a service
  const fetchTimeSlots = async (serviceId) => {
    try {
      const response = await axiosInstance.get(`/timeslots/available?serviceId=${serviceId}&date=`);
      setTimeSlots(response.data);
    } catch (err) {
      toast.error('Failed to load time slots');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle form input changes for service
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === 'price'
          ? value === ''
            ? ''
            : parseFloat(value) || ''
          : name === 'duration'
          ? value === ''
            ? ''
            : parseInt(value) || ''
          : value,
    });
  };

  // Handle time slot input changes
  const handleTimeSlotChange = (e) => {
    const { name, value } = e.target;
    setNewTimeSlot({ ...newTimeSlot, [name]: value });
  };

  // Open modal for creating or editing a service
  const openModal = (service = null) => {
    if (service) {
      if (!service.id || service.price == null || service.duration == null) {
        toast.error('Invalid service data');
        return;
      }
      setIsEditMode(true);
      setCurrentService(service);
      setFormData({
        name: service.name || '',
        description: service.description || '',
        price: service.price.toString(),
        duration: service.duration.toString(),
        serviceType: service.serviceType || '',
      });
      fetchTimeSlots(service.id);
    } else {
      setIsEditMode(false);
      setCurrentService(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        serviceType: '',
      });
      setTimeSlots([]);
    }
    setNewTimeSlot({ date: '', startTime: '', endTime: '' });
    setError('');
    setIsModalOpen(true);
  };

  // Handle form submission for create/update service
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.price === '' || formData.duration === '' || !formData.serviceType) {
      setError('Please fill in all required fields');
      return;
    }
    if (parseFloat(formData.price) < 0 || parseInt(formData.duration) < 1) {
      setError('Price must be non-negative and duration must be at least 1 minute');
      return;
    }
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
      };
      if (isEditMode) {
        await updateService(currentService.id, payload);
        toast.success('Service updated successfully');
      } else {
        await createService(payload);
        toast.success('Service created successfully');
      }
      fetchServices();
      setIsModalOpen(false);
    } catch (err) {
      handleError(err, isEditMode ? 'Failed to update service' : 'Failed to create service');
    }
  };

  // Handle time slot submission
  const handleAddTimeSlot = async (e) => {
    e.preventDefault();
    if (!newTimeSlot.date || !newTimeSlot.startTime || !newTimeSlot.endTime) {
      setError('Please fill in all time slot fields');
      return;
    }
    try {
      await axiosInstance.post('/timeslots', {
        ...newTimeSlot,
        serviceId: currentService?.id,
      });
      toast.success('Time slot added successfully');
      fetchTimeSlots(currentService?.id);
      setNewTimeSlot({ date: '', startTime: '', endTime: '' });
    } catch (err) {
      handleError(err, 'Failed to add time slot');
    }
  };

  // Handle time slot deletion
  const handleDeleteTimeSlot = async (id) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      try {
        await axiosInstance.delete(`/timeslots/${id}`);
        toast.success('Time slot deleted successfully');
        fetchTimeSlots(currentService?.id);
      } catch (err) {
        toast.error('Failed to delete time slot');
      }
    }
  };

  // Handle service deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (err) {
        handleError(err, 'Failed to delete service');
      }
    }
  };

  // Handle errors
  const handleError = (err, defaultMessage) => {
    if (err.response?.status === 401) {
      setError('Unauthorized: Please log in again');
    } else if (err.response?.data?.error) {
      setError(err.response.data.error);
    } else if (err.response?.data?.details) {
      const errors = err.response.data.details;
      setError(
        typeof errors === 'object'
          ? Object.entries(errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(', ')
          : defaultMessage
      );
    } else {
      setError(defaultMessage);
    }
  };

  // Filter services based on search term
  const filteredServices = services.filter(
    (service) =>
      service &&
      ((service.name && service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Pagination logic
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Washing Services</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" /> Add New Service
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search services by name or description..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
        </div>
      ) : (
        <>
          {/* Services Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FiDollarSign className="inline mr-1" /> Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FiClock className="inline mr-1" /> Duration (mins)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentServices.length > 0 ? (
                    currentServices.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{service.description || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.serviceType || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${parseFloat(service.price).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openModal(service)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            aria-label={`Edit ${service.name}`}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="text-red-600 hover:text-red-900"
                            aria-label={`Delete ${service.name}`}
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        {services.length === 0 ? 'No services available' : 'No matching services found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredServices.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstService + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastService, filteredServices.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredServices.length}</span> services
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal for Create/Edit Service and Time Slots */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{isEditMode ? 'Edit Service' : 'Add New Service'}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <input
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., BASIC, PREMIUM, DELUXE"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  {isEditMode ? 'Update' : 'Create'} Service
                  <FiCheck className="ml-2" />
                </button>
              </div>
            </form>

            {/* Time Slots Section (only in edit mode) */}
            {isEditMode && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FiCalendar className="mr-2" /> Time Slots
                </h3>
                <form onSubmit={handleAddTimeSlot} className="mb-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={newTimeSlot.date}
                        onChange={handleTimeSlotChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        value={newTimeSlot.startTime}
                        onChange={handleTimeSlotChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        value={newTimeSlot.endTime}
                        onChange={handleTimeSlotChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <FiPlus className="mr-2" /> Add Time Slot
                  </button>
                </form>
                {timeSlots.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-1 text-left">Date</th>
                          <th className="py-1 text-left">Start Time</th>
                          <th className="py-1 text-left">End Time</th>
                          <th className="py-1 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((slot) => (
                          <tr key={slot.id} className="border-b">
                            <td className="py-1">{slot.date}</td>
                            <td className="py-1">{slot.startTime}</td>
                            <td className="py-1">{slot.endTime}</td>
                            <td className="py-1 text-right">
                              <button
                                onClick={() => handleDeleteTimeSlot(slot.id)}
                                className="text-red-600 hover:text-red-900"
                                aria-label={`Delete time slot for ${slot.date}`}
                              >
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No time slots available</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WashService;