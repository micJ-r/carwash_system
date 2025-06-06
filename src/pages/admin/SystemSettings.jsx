import React, { useState } from 'react';
import { 
  FiSettings,
  FiSave,
  FiLock,
  FiMail,
  FiBell,
  FiCreditCard,
  FiCalendar,
  FiUser,
  FiShield,
  FiDatabase
} from 'react-icons/fi';

function SystemSettings() {
  const [settings, setSettings] = useState({
    businessName: "WashPro Car Wash",
    businessHours: {
      open: "08:00",
      close: "18:00"
    },
    emailNotifications: true,
    smsNotifications: false,
    paymentMethods: {
      cash: true,
      card: true,
      mobilePay: false
    },
    securityLevel: "medium",
    dataRetention: 365,
    adminNotifications: true
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (parent, key, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1500);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
          <FiSettings className="mr-2" /> System Settings
        </h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
        >
          <FiSave className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'general' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center">
                <FiSettings className="mr-2" /> General
              </div>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'notifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center">
                <FiBell className="mr-2" /> Notifications
              </div>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'payments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center">
                <FiCreditCard className="mr-2" /> Payments
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center">
                <FiShield className="mr-2" /> Security
              </div>
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'data' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center">
                <FiDatabase className="mr-2" /> Data
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2" /> Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={settings.businessName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Hours
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={settings.businessHours.open}
                      onChange={(e) => handleNestedChange('businessHours', 'open', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={settings.businessHours.close}
                      onChange={(e) => handleNestedChange('businessHours', 'close', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiMail className="mr-2" /> Email Notifications
              </h2>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                  Enable email notifications
                </label>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiBell className="mr-2" /> SMS Notifications
              </h2>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  name="smsNotifications"
                  checked={settings.smsNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                  Enable SMS notifications
                </label>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2" /> Admin Notifications
              </h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="adminNotifications"
                  name="adminNotifications"
                  checked={settings.adminNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="adminNotifications" className="ml-2 block text-sm text-gray-700">
                  Receive admin notifications
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiCreditCard className="mr-2" /> Payment Methods
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cashPayment"
                    checked={settings.paymentMethods.cash}
                    onChange={() => handleNestedChange('paymentMethods', 'cash', !settings.paymentMethods.cash)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cashPayment" className="ml-2 block text-sm text-gray-700">
                    Accept Cash Payments
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cardPayment"
                    checked={settings.paymentMethods.card}
                    onChange={() => handleNestedChange('paymentMethods', 'card', !settings.paymentMethods.card)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cardPayment" className="ml-2 block text-sm text-gray-700">
                    Accept Card Payments
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="mobilePayment"
                    checked={settings.paymentMethods.mobilePay}
                    onChange={() => handleNestedChange('paymentMethods', 'mobilePay', !settings.paymentMethods.mobilePay)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="mobilePayment" className="ml-2 block text-sm text-gray-700">
                    Accept Mobile Payments (Apple Pay/Google Pay)
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiShield className="mr-2" /> Security Level
              </h2>
              <div className="space-y-2">
                {['low', 'medium', 'high'].map((level) => (
                  <div key={level} className="flex items-center">
                    <input
                      type="radio"
                      id={`security-${level}`}
                      name="securityLevel"
                      checked={settings.securityLevel === level}
                      onChange={() => handleChange({ target: { name: 'securityLevel', value: level } })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor={`security-${level}`} className="ml-2 block text-sm text-gray-700 capitalize">
                      {level} security
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiLock className="mr-2" /> Password Policy
              </h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  Current password policy requires:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Minimum 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character</li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Data Settings */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiDatabase className="mr-2" /> Data Retention
              </h2>
              <div>
                <label htmlFor="dataRetention" className="block text-sm font-medium text-gray-700 mb-1">
                  Keep customer data for (days):
                </label>
                <select
                  id="dataRetention"
                  name="dataRetention"
                  value={settings.dataRetention}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                  <option value="730">2 years</option>
                  <option value="0">Indefinitely</option>
                </select>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiCalendar className="mr-2" /> Data Backup
              </h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-3">
                  Last backup: May 15, 2023 at 2:30 AM
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                  Create Manual Backup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemSettings;