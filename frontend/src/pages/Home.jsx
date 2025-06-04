import React, { useEffect, useReducer } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../redux/userSlice';

const Home = () => {

  const user = useSelector(state => state.user);
  const dispatch =useDispatch();
  console.log("User data: ",user);
  const navigate = useNavigate();


  const fetchUserDetails = async() => {
    try{
        const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
        const response = await axios({
          url: URL,
          withCredentials: true,
        })

        dispatch(setUser(response?.data?.data))
        if(response?.data?.logout){
            dispatch(logout());
            navigate("/email");
        }

        console.log("Current user details: ",response);
    }catch(err){
        console.log("Error",err);
    }
  }


  useEffect(() =>{
      fetchUserDetails();
  },[])


  return (
    <div>
      Home Page

      {/**  Messagee components */}
      <section>
        <Outlet></Outlet>
      </section>
    </div>
  )
}

export default Home
