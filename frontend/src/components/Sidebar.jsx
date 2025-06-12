import React, { useState } from 'react'
import { BsChatDotsFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';
import { FaPowerOff } from "react-icons/fa6";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { logout } from '../redux/userSlice';
import toast from 'react-hot-toast';
import Divider from './Divider';
import { FaLocationArrow } from "react-icons/fa";
import SearchUser from './SearchUser';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FaImage } from "react-icons/fa6";
import { PiVideoFill } from "react-icons/pi";



const Sidebar = () => {

    const user = useSelector(state => state?.user);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const socketConnection = useSelector(state => state?.user?.socketConnection);

    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('sidebar', user._id);

            socketConnection.on('conversation', (data) => {
                console.log("conversation ", data);
                const conversationUserData = data.map((conv, index) => {
                    if (conv?.sender?._id === conv?.receiver?._id) return { ...conv, userDetails: conv?.sender }
                    else if (conv?.receiver?._id !== conv?._id) {
                        return {
                            ...conv,
                            userDetails: conv?.receiver
                        }
                    } else {
                        return {
                            ...conv,
                            userDetails: conv?.sender
                        }
                    }
                })

                console.log("all user conversation data :", conversationUserData);
                setAllUser(conversationUserData);
            })
        }
    }, [socketConnection, user]);

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged Out");
        navigate("/email");
        localStorage.clear();
    }
    return (
        <div className='w-full h-full grid grid-cols-[48px_1fr] bg-white'>
            <div className='bg-slate-300 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
                <div>
                    <NavLink className={({ isActive }) => `w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='chat'>
                        <BsChatDotsFill size={25} />
                    </NavLink>
                    <div title='add Friend' onClick={() => setOpenSearchUser(true)} className='w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' >
                        <FaUserPlus size={25} />
                    </div>
                </div>
                <div className='flex flex-col items-center'>

                    <button className='mx-auto cursor-pointer' title={user?.name} onClick={() => setEditUserOpen(true)}>
                        <Avatar width={38} heigh={38} name={user.name} imageUrl={user?.profile_pic} userId={user?._id}>

                        </Avatar>
                    </button>


                    <button title='logout' onClick={handleLogout} className='w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'>
                        <span className='-ml-2'>
                            <FaPowerOff size={24} />
                        </span>
                    </button>
                </div>
            </div>


            <div className='w-full'>
                <div className='h-16 flex items-center'>
                    <h2 className='text-xl font-bold p-4 text-slate-800 h-16'>Message</h2>
                </div>
                <Divider />

                <div className='h-[calc(100vh-65px)]  scrollbar overflow-x-hidden overflow-y-auto '>
                    {
                        allUser.length == 0 && (
                            <div>
                                <div className='flex justify-center items-center  my-4 text-slate-400 mt-10'>
                                    <FaLocationArrow
                                        className='text-green-600'
                                        size={50}
                                    />
                                </div>
                                <p className='text-lg text-center text-slate-400'>Explore Users to start a conversation</p>
                            </div>
                        )
                    }

                    {
                        allUser.map((conv, index) => {
                            return (
                                <NavLink to={"/"+conv?.userDetails?._id} key={conv?._id} className='flex flex-row gap-2 p-2 border border-transparent cursor-pointer hover:bg-green-200 hover:rounded'>
                                    <div>
                                        <Avatar
                                            imageUrl={conv?.userDetails?.profile_pic}
                                            name={conv?.userDetails?.name}
                                            width={45}
                                            height={45}
                                        />

                                    </div>
                                    <div >
                                        <h3 className='text-ellipsis line-clamp-1 font-semibold'>
                                            {conv?.userDetails?.name}
                                        </h3>
                                        <div className='text-slate-500 text-sm flex items-center gap-1'>
                                            <div>
                                                {
                                                    conv?.lastMsg?.imageUrl && (
                                                        <div className='flex flex-row gap-2 items-center'>
                                                            <span> <FaImage /></span>
                                                            {!conv?.lastMsg?.text && <span>Video</span> }
                                                        </div>
                                                    )
                                                }
                                                {
                                                    conv?.lastMsg?.videoUrl && (
                                                        <div className='flex flex-row gap-2 items-center'>
                                                            <span> <PiVideoFill /></span>
                                                            {!conv?.lastMsg?.text && <span>Video</span> }
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <p className='text-sm text-slate-500 text-ellipsis line-clamp-1'>
                                                {
                                                    conv?.lastMsg?.text
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    
                                        {
                                            conv?.unseenMsg > 0 && (
                                                <p className='text-xcs w-6 h-6 flex justify-center items-center text-white ml-auto p-1 bg-primary font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                            )
                                        }
                                </NavLink>
                            )
                        })
                    }

                </div>
            </div>
            {/****edit user detail */}
            {
                editUserOpen && (
                    <EditUserDetails onClose={() => setEditUserOpen(false)} user={user}>

                    </EditUserDetails>
                )
            }

            {/* Search User */}
            {
                openSearchUser && (
                    <SearchUser onClose={() => { setOpenSearchUser(false) }}
                    />
                )
            }
        </div>
    )
}

export default Sidebar



