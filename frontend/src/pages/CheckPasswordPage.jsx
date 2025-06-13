import React, { useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LuCircleUserRound } from "react-icons/lu";
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';


const CheckPasswordPage = () => {
    const [data,setData] =useState(
    {
      password: ""
    }
  );

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  
  console.log("location data in check password section: ",location);
  console.log("Data in the check password section: ",data);

  useEffect(()=>{
      if(!location?.state?.name){
        navigate("/email");
      }
  },[]);
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
  const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`;

  try {
    const response = await axios.post(
      URL,
      {
        userId: location?.state?._id,
        password: data?.password
      },
      { withCredentials: true }
    );

    toast.success(response?.data?.message);

    // console.log("Response received during token: ",response);
    if(response?.data?.success){
      dispatch(setToken(response?.data?.token));
      // console.log("Token during login ",response?.data?.token);
      localStorage.setItem('token',response?.data?.token);
    }

    if (response?.data?.success) {
      setData({ password: "" });
      navigate("/");
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || "Something went wrong");
  }
};

    // let valu = "Puskar Kumar";
  return (
    <div className='mt-10'>
          <div className='bg-white w-full max-w-sm  rounded overflow-hidden p-4 mx-auto'>
            
            <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
                {/* <LuCircleUserRound size={120} className='w-fit mx-auto mb-2' /> */}
                <Avatar name = {location?.state?.name}
                 width ={100} 
                 height={100}
                 imageUrl={location?.state?.profile_pic}
                 />
                 <h2 className='font-semibold text-lg mt-2'>{location?.state?.name.toUpperCase()}</h2>
            </div>
            <h3>
              Welcome to ChatApp
            </h3>
    
            <form action="" onSubmit={handleSubmit} className='grid gap-4 mt-5'>
    
              <div className='flax flex-col gap-1'>
                <label htmlFor="password">Password :</label><br />
                <input type="password" id="password" name="password" placeholder='Enter your password'
                  className='w-full bg-slate-100 px-2 py-1 focus:outline-primary'
                  value={data?.password}
                  onChange={handleOnChange}
                  required
                />
              </div>
    
    
              <button
                  className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded font-bold text-white leading-relaxed tracking-wider'
                >
    
                    Login
              </button>
    
            </form>
    
            <p className='my-2 text-center'>
              <Link to={"/forgot-password"} className='hover:text-primary font-semibold' > Forgot Password </Link>
            </p>
          </div>
        </div>
  )
}

export default CheckPasswordPage




