import React from 'react';
import { FaMapMarkerAlt, FaHandsHelping, FaLeaf, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

function About() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-16">
      {/* Header */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#ffe31a] mb-4">About SparkleWash</h1>
        <p className="text-lg text-gray-300">
          Delivering premium vehicle wash services in the heart of Tanzania — <strong>Dodoma</strong>.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 mb-20">
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-2xl font-semibold text-[#ffe31a] mb-4">Our Mission</h2>
          <p className="text-gray-300">
            To provide top-quality, eco-friendly, and affordable car wash services while ensuring customer satisfaction and environmental care.
          </p>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-2xl font-semibold text-[#ffe31a] mb-4">Our Vision</h2>
          <p className="text-gray-300">
            To become Dodoma’s most trusted and innovative car wash service through integrity, technology, and exceptional care.
          </p>
        </motion.div>
      </div>

      {/* Values or Features */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center mb-20">
        {[
          { icon: <FaHandsHelping />, title: 'Professional Service', desc: 'Friendly and skilled staff focused on quality.' },
          { icon: <FaLeaf />, title: 'Eco-Friendly', desc: 'Water-efficient systems and biodegradable products.' },
          { icon: <FaClock />, title: 'Fast Turnaround', desc: 'Quick service without compromising quality.' },
          { icon: <FaMapMarkerAlt />, title: 'Dodoma Based', desc: 'Proudly serving the local community of Dodoma.' },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-[#ffe31a]/60 transition-transform hover:-translate-y-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="text-4xl text-[#ffe31a] mb-4 mx-auto">{item.icon}</div>
            <h3 className="text-xl font-semibold text-[#ffe31a] mb-2">{item.title}</h3>
            <p className="text-gray-300 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Dodoma Location Map or Info */}
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h2 className="text-2xl font-bold text-[#ffe31a] mb-4">Visit Us in Dodoma</h2>
        <p className="text-gray-300 mb-4">
          SparkleWash is located near Nyerere Square, Dodoma City Center.
        </p>
        <div className="overflow-hidden rounded-xl shadow-lg mt-4">
          <iframe
            title="SparkleWash Location in Dodoma"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31857.054066360307!2d35.7387387!3d-6.1629599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x184b51201a0f6293%3A0x94e9b9629f1c8a4!2sDodoma!5e0!3m2!1sen!2stz!4v1686657982412"
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-none w-full h-[300px]"
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
}

export default About;
