import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [data,setData] =useState(
    {
      name: "",
      email: "",
      password: "",
      profile_pic: ""
    }
  );

  const [uploadPhoto, setUploadPhoto] = useState("");
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

  
  const handleUploadPhoto = async (e) => {
      const file = e.target.files[0];
      const uploadPhoto2 = await uploadFile(file);
      setData((prev) => {
        return {
          ...prev,
          profile_pic: uploadPhoto2?.url
        }
      })
      
      setUploadPhoto(file);
      
  }

  const handleClearUploadPhoto =(e)=>{
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`;

      try{
         const response = await axios.post(URL,data);
         toast.success(response?.data?.message);
         if(response?.data?.success){
            setData(
              {
                name: "",
                email: "",
                password: "",
                profile_pic: ""
              }
            );
            navigate("/email");
         }
      }catch(err){
         toast.error(err?.response?.data?.message);
      }
  }


  return (
    <div className='mt-10'>
      <div className='bg-white w-full max-w-sm  rounded overflow-hidden p-4 mx-auto'>
        <h3>
          Welcome to ChatApp
        </h3>

        <form action="" onSubmit={handleSubmit} className='grid gap-4 mt-5'>

          <div className='flax flex-col gap-1'>
            <label htmlFor="name">Name</label><br />
            <input type="text" id="name" name="name" placeholder='Enter your name'
              className='bg-slate-100 px-2 py-1 focus:outline-primary w-full'
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flax flex-col gap-1'>
            <label htmlFor="email">Email</label><br />
            <input type="email" id="email" name="email" placeholder='Enter your email'
              className='bg-slate-100 px-2 py-1 focus:outline-primary w-full'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flax flex-col gap-1'>
            <label htmlFor="password">Password :</label><br />
            <input type="password" id="password" name="password" placeholder='Enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary w-full'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flax flex-col gap-1'>
            <label htmlFor="profile_pic">Photo :
                  <div className='w-full h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                    <p className='text-sm max-w-[200] text-ellipsis line-clamp-1'>
                      {
                        uploadPhoto?.name ? uploadPhoto.name : "upload Profile Photo"
                      }
                      {
                        uploadPhoto?.name && (
                          <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
                          <IoMdClose/>
                        </button>
                        )
                      }
                    </p>
                  </div>
              </label><br />
            <input type="file" id="profile_pic" name="profile_pic" 
              className='bg-slate-100 px-2 py-1 focus:outline-primary hidden '
              onChange={handleUploadPhoto}
            />
          </div>

          <button
              className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded font-bold text-white leading-relaxed tracking-wider'
            >

                Register
          </button>

        </form>

        <p className='my-2 text-center'>
          Already have Account ? <Link to={"/email"} className='hover:text-primary font-semibold' > Login </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
