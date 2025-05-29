import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LuCircleUserRound } from "react-icons/lu";

const CheckEmailPage = () => {
    const [data,setData] =useState(
    {
      email: ""
    }
  );

  const navigate = useNavigate();

  const handleOnChange = (e) =>{
    const {name,value} = e.target;
    setData((prev)=> {
      return {
        ...prev,
        [name]: value
      }
    })
  }


  const handleSubmit = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;

      try{
         const response = await axios.post(URL,data);
         toast.success(response?.data?.message);
         if(response?.data?.success){
            setData(
              {
                email: ""
              }
            );
            navigate("/password",{
              state: response?.data?.data
            });
         }
      }catch(err){
         toast.error(err?.response?.data?.message);
      }
  }


  return (
    <div className='mt-10'>
          <div className='bg-white w-full max-w-sm  rounded overflow-hidden p-4 mx-auto'>
            
            <div>
                <LuCircleUserRound size={120} className='w-fit mx-auto mb-2' />
            </div>
            <h3>
              Welcome to ChatApp
            </h3>
    
            <form action="" onSubmit={handleSubmit} className='grid gap-4 mt-5'>
    
              <div className='flax flex-col gap-1'>
                <label htmlFor="email">Email</label><br />
                <input type="email" id="email" name="email" placeholder='Enter your email'
                  className='w-full bg-slate-100 px-2 py-1 focus:outline-primary'
                  value={data.email}
                  onChange={handleOnChange}
                  required
                />
              </div>
    
    
              <button
                  className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded font-bold text-white leading-relaxed tracking-wider'
                >
    
                    Let's Go
              </button>
    
            </form>
    
            <p className='my-2 text-center'>
              New User ? <Link to={"/register"} className='hover:text-primary font-semibold' > Register </Link>
            </p>
          </div>
        </div>
  )
}

export default CheckEmailPage
