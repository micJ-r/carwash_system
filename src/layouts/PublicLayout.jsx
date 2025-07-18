import React from 'react';
import UserNavbar from '../components/user/UserNavbar';
import UserFooter from '../components/user/UserFooter';
import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar role="public" />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
      <UserFooter />
    </div>
  );
}

export default PublicLayout;
