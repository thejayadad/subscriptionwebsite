'use client'
import React from 'react'
import Logo from '../logo'
import { UserButton } from '@clerk/nextjs'


const Header = () => {
  return (
    <header className='px-8 py-2 border-b-[1px]'>
        <div className='flex items-center justify-between mx-auto max-w-screen-xl'>
            <div>
                <Logo />
            </div>
            <UserButton signInUrl='/'/>
        </div>
    </header>
  )
}

export default Header