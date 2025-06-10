import React, { useEffect, useState } from 'react'
import { BsSearch } from "react-icons/bs";
import CircularLoading from './CircularLoading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoCloseSharp } from "react-icons/io5";

const SearchUser = ({ onClose }) => {
    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");


    const handleSearchUser = async () => {
        if (!search.trim()) return;
        const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;

        try {
            setLoading(true);
            const response = await axios.post(URL, {
                search: search
            })
            setLoading(false);
            setSearchUser(response?.data?.data)

        } catch (err) {
            toast.error(err?.response?.data?.message);
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            handleSearchUser();
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounce);
    }, [search]);

    console.log("Search Result: ", searchUser);
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700/40 p-2'>
            <div className='w-full max-w-lg mx-auto mt-5 '>
                {/* input Search User */}
                <div className='bg-white rounded h-15 flex '>
                    <input
                        type="text"
                        placeholder='Search user by name, email ...'
                        className='w-full outline-none py-1 h-full px-4'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                    <div className='h-15 w-15 flex justify-center items-center'>
                        <BsSearch
                            size={25}
                            className='text-green-400'
                        // onClick={handleSearchUser}
                        />
                    </div>
                </div>
                {/* Display Search User */}

                <div className='bg-white mt-2 w-full p-4 rounded'>
                    {/* No user found */}
                    {
                        searchUser.length === 0 && !loading && (
                            <p className='text-slate-500 text-center'>
                                No User Found
                            </p>
                        )
                    }

                    {
                        loading && (
                            <CircularLoading />
                        )
                    }

                    {
                        searchUser.length !== 0 && !loading && (
                            searchUser.map((user, index) => {
                                return (
                                    <UserSearchCard key={user._id} user={user} onClose={onClose} />
                                )
                            })
                        )
                    }
                </div>
            </div>
            <div className='absolute top-0 right-0 text-2xl p-2 text-red-600 hover:text-primary ' onClick={onClose}>
                <IoCloseSharp size={25}/>
            </div>
        </div>
    )
}

export default SearchUser
