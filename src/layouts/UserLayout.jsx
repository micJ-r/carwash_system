import React from 'react';
import UserNavbar from '../components/user/UserNavbar';
import UserFooter from '../components/user/UserFooter';
import { Outlet } from 'react-router-dom';

function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar />
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
      <UserFooter />
    </div>
  );
}

export default UserLayout;
