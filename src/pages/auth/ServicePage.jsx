import React from 'react';
import {
  FaCar,
  FaCouch,
  FaCarSide,
  FaMotorcycle,
  FaTruckMonster,
  FaBus,
  FaWrench,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

function ServicePage() {
  const services = [
    {
      title: 'Exterior Only',
      description: 'Shiny exterior cleaning with waxing, tire polish, and drying.',
      icon: <FaCar className="text-[#ffe31a] text-5xl mb-4" />,
    },
    {
      title: 'Interior Only',
      description: 'Deep interior cleaning including vacuuming, dashboard polish, and deodorizing.',
      icon: <FaCouch className="text-[#ffe31a] text-5xl mb-4" />,
    },
    {
      title: 'Full Exterior & Interior',
      description: 'Complete inside-out cleaning and detailing for your car.',
      icon: <FaCarSide className="text-[#ffe31a] text-5xl mb-4" />,
    },
    {
      title: 'Motorcycle Wash',
      description: 'Gentle, detailed wash for bikes and scooters including chrome polishing.',
      icon: <FaMotorcycle className="text-[#ffe31a] text-5xl mb-4" />,
    },
    {
      title: 'Truck & Lorry Wash',
      description: 'Heavy-duty wash for your pickup trucks and lorries.',
      icon: <FaTruckMonster className="text-[#ffe31a] text-5xl mb-4" />,
    },
    {
      title: 'Bus & Semi-Trailer Wash',
      description: 'Comprehensive cleaning for large fleet vehicles and trailers.',
      icon: <FaBus className="text-[#ffe31a] text-5xl mb-4" />,
    },
    {
      title: 'Custom Detailing Service',
      description: 'Tailored wash for unique vehicles or special needs.',
      icon: <FaWrench className="text-[#ffe31a] text-5xl mb-4" />,
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-16">
      <motion.div
        className="max-w-5xl mx-auto text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#ffe31a] mb-8">
          Vehicle Wash Services
        </h1>
        <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
          From motorcycles to semi-trucks, we clean all vehicle types with professional care and attention to detail.
        </p>
      </motion.div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-[#ffe31a]/60 transition-transform hover:-translate-y-2 text-center"
            whileHover={{ scale: 1.05 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            {service.icon}
            <h3 className="text-2xl font-semibold text-[#ffe31a] mb-3">{service.title}</h3>
            <p className="text-gray-300">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ServicePage;
