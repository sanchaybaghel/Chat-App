import { animationDefaultOptions } from '@/lib/utils'
import React from 'react'
import Lottie from 'react-lottie'

const EmptyChatContainer = () => {
  return (
    <div className='flex-1 bg-[#1c1d25] flex flex-col justify-center items-center w-full h-full'>
        <Lottie
            isClickToPauseDisabled={true}
            height={200}
            width={200}
            options={animationDefaultOptions}
        />
        <div className='text-opacity-80 text-white gap-5 items-center mt-10 lg:text-4xl transition-all duration-300 text-center'>
        <h3 className='poppins-medium'></h3>
            Hi<span className='text-purple-500'>!</span> Welcome to
            <span className='to-purple-500'> Synchronous</span> Chat App 
            <span className='text-purple-500'>.</span>
        </div>
    </div>
  )
}

export default EmptyChatContainer
