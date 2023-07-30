import React from 'react';
import {Triangle} from 'react-loader-spinner';

const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <Triangle color='#d12121' height={50} width={50} className='m-5'/>
      <p className='text-lg text-center px-2'>{message}</p>
    </div>
  )
}

export default Spinner