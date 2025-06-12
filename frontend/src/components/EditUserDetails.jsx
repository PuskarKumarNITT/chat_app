import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import {setUser} from "../redux/userSlice"

const EditUserDetails = ({ onClose, user }) => {

    const [data, setData] = useState({
        name: user?.user,
        profile_pic: user?.profile_pic
    });

    const uploadPhotoRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        setData((prev) => {
            return {
                ...prev,
                ...user
            }
        })
    }, [user])
    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleOpenUploadPhoto = (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadPhotoRef.current.click();
    }


    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];

        const uploadPhoto = await uploadFile(file);

        setData((prev) => {

            return {
                ...prev,
                profile_pic: uploadPhoto?.url
            }
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try{
            const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update-user`;
            const response = await axios({
                method:'post',
                url: URL,
                data: data,
                withCredentials: true
            });
            toast.success(response?.data?.message);
            if(response?.data?.success){
                dispatch(setUser(response?.data?.data));
                onClose();
            }

        }catch(err){
            toast.error(err?.response?.data?.message);
        }

    }
    return (
        <div className='fixed top-0 bottom-0 right-0 left-0 bg-gray-700/40 flex justify-center items-center z-10'>
            <div className='bg-white p-4 py-6 my-5  m-1 rounded w-full max-w-sm'>
                <h2 className='font-semibold'>
                    Profile Details
                </h2>
                <p className='text-sm'>
                    Edit user detail
                </p>

                <form action="" className='flex flex-col mt-3' onSubmit={handleSubmit}>
                    <div className=' grid gap-3 mt-3'>
                        <label htmlFor="name"> Name :</label>
                        <input
                            type="text"
                            name='name'
                            id='name'
                            value={data?.name || ''}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 border border-black/20 focus:outline-primary rounded backdrop-blur-sm border-0.5'
                        />
                    </div>
                    <br />
                    <div className=''>
                        <div>Photo</div>
                        <div className='my-1 flex items-center gap-4 mb-3' >
                            <div className="ml-0">
                                <Avatar
                                    width={40}
                                    height={40}
                                    imageUrl={data.profile_pic}
                                    name={data?.name}
                                />
                            </div>

                            <label htmlFor="profile_pic">
                                <button className='font-semibold cursor-pointer' onClick={handleOpenUploadPhoto}> Change Photo </button>
                                <input type="file"
                                    id='profile_pic'
                                    className='hidden'
                                    onChange={handleUploadPhoto}
                                    ref={uploadPhotoRef}
                                />
                            </label>
                        </div>
                    </div>

                    <Divider></Divider>
                    <div className='flex gap-2 ml-auto mt-3'>
                        <button onClick={onClose} className='border-primary text-primary border px-4 py-1 rounded hover:bg-red-500 hover:text-white'>Cancel</button>
                        <button onClick={handleSubmit} className='border-primary bg-primary rounded text-white border px-4 py-1 hover:bg-secondary'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default React.memo(EditUserDetails)
