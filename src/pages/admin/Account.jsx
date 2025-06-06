import React, { useState } from 'react';
import { 
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiCreditCard,
  FiCalendar,
  FiSettings,
  FiSave,
  FiEdit2,
  FiTrash2,
  FiPlus
} from 'react-icons/fi';

function Account() {
  const [account, setAccount] = useState({
    name: 'Admin User',
    email: 'admin@washpro.com',
    phone: '(123) 456-7890',
    joinDate: '2022-01-15',
    subscription: 'Premium',
    nextBilling: '2023-06-15',
    status: 'Active'
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/24', primary: true },
    { id: 2, type: 'Mastercard', last4: '5555', expiry: '06/25', primary: false }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAccount = () => {
    setIsEditing(false);
    // Add save to API logic here
    alert('Account details updated successfully!');
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    // Add payment method logic here
    alert('Payment method added successfully!');
    setShowAddPayment(false);
    setNewPayment({
      cardNumber: '',
      expiry: '',
      cvc: '',
      name: ''
    });
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSetPrimary = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      primary: method.id === id
    })));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
          <FiUser className="mr-2" /> Account Settings
        </h1>
        {isEditing ? (
          <button 
            onClick={handleSaveAccount}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FiSave className="mr-2" /> Save Changes
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md flex items-center"
          >
            <FiEdit2 className="mr-2" /> Edit Account
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Information */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FiSettings className="mr-2" /> Account Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={account.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{account.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={account.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{account.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={account.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{account.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Join Date</label>
              <p className="text-gray-900 font-medium flex items-center">
                <FiCalendar className="mr-2" /> {account.joinDate}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FiCreditCard className="mr-2" /> Subscription
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Plan</label>
                <p className="text-gray-900 font-medium">{account.subscription}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  account.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {account.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Next Billing</label>
                <p className="text-gray-900 font-medium">{account.nextBilling}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <FiCreditCard className="mr-2" /> Payment Methods
            </h2>
            <button 
              onClick={() => setShowAddPayment(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <FiPlus className="mr-1" /> Add New
            </button>
          </div>

          {showAddPayment ? (
            <form onSubmit={handleAddPayment} className="mb-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={newPayment.cardNumber}
                    onChange={handlePaymentInputChange}
                    placeholder="4242 4242 4242 4242"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <input
                      type="text"
                      name="expiry"
                      value={newPayment.expiry}
                      onChange={handlePaymentInputChange}
                      placeholder="MM/YY"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input
                      type="text"
                      name="cvc"
                      value={newPayment.cvc}
                      onChange={handlePaymentInputChange}
                      placeholder="123"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                  <input
                    type="text"
                    name="name"
                    value={newPayment.name}
                    onChange={handlePaymentInputChange}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPayment(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Card
                </button>
              </div>
            </form>
          ) : null}

          <div className="space-y-3">
            {paymentMethods.length > 0 ? (
              paymentMethods.map(method => (
                <div key={method.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{method.type} •••• {method.last4}</span>
                        {method.primary && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Primary</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Expires {method.expiry}</div>
                    </div>
                    <div className="flex space-x-2">
                      {!method.primary && (
                        <button 
                          onClick={() => handleSetPrimary(method.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Set Primary
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeletePayment(method.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No payment methods added
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Account Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                Request Data Export
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;