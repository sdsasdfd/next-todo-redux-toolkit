'use client'
import Navbar from '@/components/Navbar'
import TawkTo from '@/components/TawkTo'
import { useUserData } from '@/hooks/useUserData'
import React from 'react'

const UserLayout = ({children}: {children: React.ReactNode}) => {
  useUserData()
  return (
    <>
    <Navbar/>
    {children}
    <TawkTo/>
    </>
  )
}

export default UserLayout