import React from 'react'
import * as FaIcons from "react-icons/fa";

const CrticalBox = ({data}) => {
  let Icon = FaIcons[data.icon]
  return (
    <div className='criticalBox mb-2 flex items-start gap-[10px] p-[15px] rounded-lg bg-[#16181E]'>
      <i className='text-[25px] text-[#FFB4AB] mt-2'>{Icon && <Icon/>}</i>
      <div>
        <h3 className='text-[20px] font-[700] mb-1'>{data.title}</h3>
        <p className='text-[14px] text-gray-500'>{data.description}</p>
      </div>
    </div>
  )
}

export default CrticalBox