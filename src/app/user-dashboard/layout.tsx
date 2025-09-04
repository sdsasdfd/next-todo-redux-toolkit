'use client'
import Navbar from '@/components/Navbar'
import TawkTo from '@/components/TawkTo'
import { useUserData } from '@/hooks/useUserData'


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