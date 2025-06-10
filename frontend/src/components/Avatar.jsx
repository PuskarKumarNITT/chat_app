import { split } from 'postcss/lib/list';
import React from 'react'
import { PiUserCircle } from 'react-icons/pi'
import { useSelector } from 'react-redux';

const Avatar = ({ userId, name, imageUrl, width, height }) => {

    const onlineUser = useSelector(state => state?.user?.onlineUser);



    let avatarName = "";
    if (name) {
        const splitName = name?.toUpperCase()?.split(" ");
        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0];
        } else {
            avatarName = splitName[0][0];
        }
    }

    const bgColor = [
        'bg-slate-200',
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-yellow-200'
    ];

    const randomNumber = Math.floor(Math.random() * 5);

    const isOnline = onlineUser.includes(userId);
    return (
        <div className={`text-slate-800 rounded-full w-fit mx-auto shadow-xl border-amber-50 text-4xl font-bold relative`} style={{ width: width + "px", height: height + "px" }}>
            {
                imageUrl ? (
                    <img src={imageUrl} alt={name} width={width} height={height} />
                ) : (
                    name ? (
                        <div
                            style={{ width: width + "px", height: height + "px" }}
                            className={`overflow-hidden rounded-full flex justify-center items-center ${bgColor[randomNumber]} text-black text-center whitespace-nowrap`}
                        >
                            <span
                                className="w-full truncate text-[calc(min(0.5*var(--h),0.5*var(--w)))]"
                                style={{
                                    fontSize: Math.min(width, height) / 2.5 + "px", // adjust this scale as needed
                                    lineHeight: height + "px"
                                }}
                            >
                                {avatarName}
                            </span>
                        </div>

                    ) : (
                        <PiUserCircle size={width} className='w-fit mx-auto ' />
                    )
                )
            }
            {isOnline && (
                <div className='bg-green-500 p-1 absolute top-2 right-2 z-10 rounded-full'>

                </div>
            )}

        </div>
    )
}

export default Avatar
