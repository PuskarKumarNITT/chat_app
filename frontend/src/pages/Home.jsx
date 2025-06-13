import React, { useEffect, useReducer, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setOnlineUser, setUser } from '../redux/userSlice';  // setSocketConnection,
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png'
import { io } from 'socket.io-client'


const Home = () => {

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  console.log("User data: ", user);
  const navigate = useNavigate();
  const location = useLocation();

  const socketRef = useRef(null);

  console.log("user: ", user);
  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      })

      dispatch(setUser(response?.data?.data))
      if (response?.data?.data?.logout) {
        dispatch(logout());
        navigate("/email");
        localStorage.clear();
      }

      console.log("Current user details: ", response);
    } catch (err) {
      console.log("Error", err);
    }
  }


  useEffect(() => {
    fetchUserDetails();
  }, [])

  // socket connectinons 

  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    socketRef.current = socket;

    socketConnection.on('onlineUser', (data) => {
      console.log('data: ', data);
      dispatch(setOnlineUser(data))
    });

    dispatch(setSocketConnection(socketConnection));
    return () => {
      socketConnection.disconnect();
      localStorage.clear();
    }
  }, []);

  const basePath = location.pathname === "/";

  return (
    <div className='grid lg:grid-cols-[300px_1fr] h-screen max-h-screen'>

      <section className={`bg-white  ${!basePath && 'hidden'} lg:block`}>
        <Sidebar />
      </section>


      {/**  Messagee components */}
      <section className={`${basePath && 'hidden'}`}>
        <Outlet />
      </section>

      {basePath && (
        <div className='justify-center items-center flex-col gap-2 hidden lg:flex'>
          <div>
            <img src={logo} alt="logo" width={100} />
          </div>
          <p className='text-lg mt-2 text-slate-500'>Select user to send Message</p>
        </div>
      )}


    </div>
  )
}

export default Home
