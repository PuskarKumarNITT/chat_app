import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom'
import Avatar from './Avatar';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { PiVideoFill } from "react-icons/pi";
import { IoIosClose } from "react-icons/io";
import uploadFile from '../helpers/uploadFile';
import CircularLoading from './CircularLoading';
import backgroundImg from '../assets/backgroundImg.jpg'
import { LuSendHorizontal } from "react-icons/lu";


const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  })
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  })


  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(!openImageVideoUpload);
  }

  const handleClearUploadImage = () => {
    setMessage(prev => {
      return {
        ...prev,
        imageUrl: ""
      }
    })
  }

  const handleClearUploadVideo = () => {
    setMessage(prev => {
      return {
        ...prev,
        videoUrl: ""
      }
    })
  }
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadPhoto2 = await uploadFile(file);
    setLoading(false);
    setMessage(prev => {
      return {
        ...prev,
        imageUrl: uploadPhoto2.url
      }
    })
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadVideo = await uploadFile(file);
    setLoading(false);
    setMessage(prev => {
      return {
        ...prev,
        videoUrl: uploadVideo.url
      }
    })
  }

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);

      socketConnection.on('message-user', (data) => {
        console.log("user details :", data);
        setDataUser(data);
      })
      socketConnection.on('message',(data) => {
        console.log("message data",data);
        setDataUser(data);
      })
    }
  }, [socketConnection, params?.userId, user])


  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage(prev => {
      return {
        ...prev,
        text: value
      }
    })
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if(message.text || message.imageUrl || message.videoUrl) {
      if(socketConnection){
        socketConnection.emit('new Message',{
          sender: user?._id,
          receiver: params?.userId,
          text:message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId:user?._id
        })
      }
    }

    setMessage(prev => ({
        ...prev,
        text: ""
      }));
  }
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-no-repeat bg-cover" style={{ backgroundImage: `url(${backgroundImg})` }}>

      {/* Header */}
      <header className='h-16  bg-white flex items-center justify-between px-3 shrink-0'>
        <div className='flex items-center gap-3'>
          <Link to={"/"} className='lg:hidden'>
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg'>{dataUser?.name}</h3>
            <p className='-mt-1'>
              {dataUser?.online
                ? <span className='text-primary text-sm'>online</span>
                : <span className='text-slate-400 text-sm'>offline</span>}
            </p>
          </div>
        </div>
        <button className='cursor-pointer hover:text-primary'>
          <BsThreeDotsVertical size={25} />
        </button>
      </header>

      {/* Display Image */}
      <section className='relative flex-1 bg-slate-400/25 overflow-x-hidden overflow-y-scroll scrollbar-hide [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full
  '>
        {/* {Upload Image display} */}
        {
          message?.imageUrl && (
            <div className='w-full h-full flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600 z-10' onClick={handleClearUploadImage}>
                <IoIosClose size={40} />
              </div>
              <div className='bg-white p-3 '>
                <img src={message?.imageUrl} alt="Uploaded image" className='aspect-square h-full w-full max-w-sm m-2 object-scale-down' />

              </div>
            </div>
          )
        }

        {/* {Upload Video display} */}
        {
          message?.videoUrl && (
            <div className='w-full h-full bg-slate-700/30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600 z-10' onClick={handleClearUploadVideo}>
                <IoIosClose size={40} />
              </div>
              <div className='bg-white p-3 '>
                <video src={message?.videoUrl} alt="Uploaded Video" className='aspect-squareF h-full w-full max-w-sm m-2 object-scale-down' muted controls autoPlay />

              </div>
            </div>
          )
        }

        {/* {Loading } */}
        {
          loading && (
            <div className='relative w-full h-screen flex items-center justify-center z-20' >
              <CircularLoading height={150} width={150} />
            </div>
          )
        }
      </section>

      {/* Send Message*/}
      <section className='h-16 bg-white shrink-0 flex items-center px-4 '>
        <div className='flex relative'>
          <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white'>
            <FaPlus size={20} />
          </button>
          {/* { video and image          } */}
          {
            openImageVideoUpload && (
              <div className='bg-white shadow rounded absolute bottom-12 w-28 p-2 '>
                <form>
                  <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-primary'>
                      <FaImage size={18} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label htmlFor="uploadVideo" className='flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-purple-500'>
                      <PiVideoFill size={18} />
                    </div>
                    <p>
                      Video
                    </p>
                  </label>
                  <input className='hidden' type="file" id='uploadImage' onChange={handleUploadImage} />
                  <input type="file" id='uploadVideo' onChange={handleUploadVideo} className='hidden' />
                </form>

              </div>
            )
          }
        </div>

        {/* {input box} */}

        <form action="" onSubmit={handleSendMessage} className='h-full w-full flex gap-2'>
            <input type="text" placeholder='Type message...'
              className='py-1 px-4 outline-none w-full h-full '
              value={message.text}
              onChange={handleOnChange}
            />
            <button type="submit"
             className='text-primary hover:text-secondary cursor-pointer rounded-full w-16 flex justify-center items-center' 
             >
              <LuSendHorizontal size={30}/>
            </button>
        </form>

      </section>

    </div>
  );
};

export default MessagePage;
