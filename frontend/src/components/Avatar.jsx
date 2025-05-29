import { split } from 'postcss/lib/list';
import React from 'react'
import { PiUserCircle } from 'react-icons/pi'

const Avatar = ({userId,name,imageUrl,width,height}) => {

    let avatarName = "";
    if(name){
        const splitName = name?.toUpperCase()?.split(" ");
        if(splitName.length > 1) {
            avatarName = splitName[0][0]+splitName[1][0];
        }else{
            avatarName = splitName[0][0];
        }
    }

    const bgColor =[
        'bg-slate-200',
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-yellow-200'
    ];

    const randomNumber = Math.floor(Math.random() * 5)
  return (
    <div className={`text-slate-800 overflow-hidden rounded-full w-fit mx-auto shadow-xl border-amber-50 text-4xl font-bold `} style={{width: width + "px", height : height + "px"}}>
        {
            imageUrl? (
                <img src={imageUrl} alt={name} width={width} height={height} />
            ): (
                name ? (
                    <div style={{width: width + "px", height : height + "px"}} className={`overflow-hidden rounded-full flex justify-center items-center ${bgColor[randomNumber]}`}>
                        {avatarName}
                    </div>
                ):(
                    <PiUserCircle size={width} className='w-fit mx-auto mb-2'/>
                )
            )
        }
    </div>
  )
}

export default Avatar
