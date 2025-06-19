import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';
import FormInput from '../../components/common/FormInput';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const showSuccessAlert = (role) => {
    let title = 'Login Successful!';
    let message = `Welcome ${role.toLowerCase()}! Redirecting to your dashboard...`;

    MySwal.fire({
      title: <p>{title}</p>,
      icon: 'success',
      html: <p>{message}</p>,
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        MySwal.showLoading();
      }
    }).then(() => {
      setFormData({ email: '', password: '' });
      if (formRef.current) {
        formRef.current.reset();
      }
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'STAFF') navigate('/staff/dashboard');
      else navigate('/user/dashboard');
    });
  };

  const showErrorAlert = (message) => {
    MySwal.fire({
      title: <p>Login Failed</p>,
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
      const response = await login(formData.email, formData.password);
      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }
      const role = response.user.role;
      showSuccessAlert(role);
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Login failed. Please check your credentials.';
      showErrorAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wht-900 py-12 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#ffe31a] mb-6">Login</h2>
        {authError && <p className="text-red-500 text-center mb-4">{authError}</p>}
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
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            icon={<FiMail className="text-[#ffe31a]" />}
            className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffe31a]"
            aria-label="Email input"
            error={errors.email}
            autoComplete="off"
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            icon={<FiLock className="text-[#ffe31a]" />}
            className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffe31a]"
            aria-label="Password input"
            error={errors.password}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#ffe31a] text-gray-900 font-semibold py-3 rounded-md hover:bg-yellow-400 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            aria-label="Submit login form"
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
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="/register" className="text-[#ffe31a] hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
