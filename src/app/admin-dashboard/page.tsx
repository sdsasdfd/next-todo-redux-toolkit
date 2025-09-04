'use client'
import Navbar from '@/components/Navbar'
import { RootState } from '@/lib/store/store'
import React from 'react'
import { useSelector } from 'react-redux'

const AdminDashboard = () => {

  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div>
        <Navbar/>
        <div className=' flex items-center justify-center h-[400px]'>

        <h1>Admin Dashboard</h1>
        </div>
    </div>
  )
}

export default AdminDashboard