import React from 'react';
import UserNavbar from '../components/user/UserNavbar';
import UserFooter from '../components/user/UserFooter';
import { Outlet } from 'react-router-dom';

function StaffLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar role="staff" />
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
      <UserFooter />
    </div>
  );
}

export default StaffLayout;
