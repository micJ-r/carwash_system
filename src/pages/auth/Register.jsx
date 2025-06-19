import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import FormInput from '../../components/common/FormInput';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^[\d\s\-()+]{8,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const showSuccessAlert = () => {
    MySwal.fire({
      title: <p>Registration Successful!</p>,
      icon: 'success',
      html: <p>You can now login with your credentials.</p>,
      confirmButtonText: 'Go to Login',
      confirmButtonColor: '#ffe31a',
    }).then(() => {
      // Clear form after successful submission
      setFormData({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'USER',
      });
      if (formRef.current) {
        formRef.current.reset();
      }
      navigate('/login');
    });
  };

  const showErrorAlert = (message) => {
    MySwal.fire({
      title: <p>Registration Failed</p>,
      icon: 'error',
      html: <p>{message}</p>,
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#ffe31a',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      showErrorAlert('Please fix the errors in the form');
      return;
    }

    try {
      await register(formData);
      showSuccessAlert();
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response?.status === 400) {
        const backendErrors = err.response.data;
        if (typeof backendErrors === 'object' && !backendErrors.error) {
          setErrors(backendErrors);
          errorMessage = 'Please fix the errors in the form.';
        } else {
          setErrors({ general: backendErrors.error || errorMessage });
          errorMessage = backendErrors.error || errorMessage;
        }
      }

      showErrorAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wht-900 py-12 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-[#ffe31a] mb-6">Register</h2>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6"
          autoComplete="off"
        >
          <input type="hidden" autoComplete="false" />
          <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} />
          <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} />

          <FormInput
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            icon={<FiUser className="text-[#ffe31a]" />}
            className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffe31a]"
            aria-label="Username input"
            error={errors.username}
            autoComplete="new-username"
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={<FiMail className="text-[#ffe31a]" />}
            className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffe31a]"
            aria-label="Email input"
            error={errors.email}
            autoComplete="new-email"
          />
          <FormInput
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            icon={<FiPhone className="text-[#ffe31a]" />}
            className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffe31a]"
            aria-label="Phone input"
            error={errors.phone}
            autoComplete="new-phone"
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            icon={<FiLock className="text-[#ffe31a]" />}
            className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffe31a]"
            aria-label="Password input"
            error={errors.password}
            autoComplete="new-password"
          />
          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            icon={<FiLock className="text-[#ffe31a]" />}
            className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffe31a]"
            aria-label="Confirm password input"
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#ffe31a] text-gray-900 font-semibold py-3 rounded-md hover:bg-yellow-400 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            aria-label="Submit registration"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-[#ffe31a] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
