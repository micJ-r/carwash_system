import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Service() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual API endpoint
    axios.get('http://localhost:8080/api/services')
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch services", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading services...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Available Wash Services</h2>
      {services.length === 0 ? (
        <p className="text-center text-gray-500">No services available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white p-5 rounded-2xl shadow-lg border hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-700 mb-2">{service.description}</p>
              <p className="text-green-600 font-bold text-lg">₹ {service.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Service;
