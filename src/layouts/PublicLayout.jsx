import React from 'react'
import UserNavbar from '../components/user/UserNavbar'
import { Outlet } from 'react-router-dom'
import UserFooter from '../components/user/UserFooter'

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <UserNavbar/>
    <main className="flex-grow bg-gray-100 p-6">
      <Outlet/>
    </main>
      <UserFooter/>
    </div>
  )
}

export default PublicLayout