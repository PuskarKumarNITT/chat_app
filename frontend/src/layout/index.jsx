import React from 'react'
import logo from "../assets/logo.png"
const AuthLayout = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white' >
            <img 
                src = {logo}
                alt ='logo'
                width={50}
                height={20}
            />
        </header>
        {children}
    </>
  )
}

export default AuthLayout;
