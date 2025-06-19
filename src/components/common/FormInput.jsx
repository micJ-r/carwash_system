import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required,
  icon,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="relative">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <div
          id={`${name}-error`}
          className="mt-1 text-sm text-red-600 flex items-center"
          role="alert"
        >
          <FiAlertCircle className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}

export default FormInput;