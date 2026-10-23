import React from 'react'
import { IoSettings } from 'react-icons/io5'

const Navbar = ({ onCopy, onDownload }) => {
  return (
    <div className='navbar'>
      <div className="logo">
        <h3 className='text-[18px] font-[700] text-[var(--blue)]'>S.A.G.E</h3>
      </div>
      <div className="links">
        <a href="#">History</a>
        <a href="#">Documentation</a>
        <a href="#">Account</a>
      </div>
      <div className="right">
        <button className="trans" onClick={onCopy}>Copy Report</button>
        <button className="blue-btn" onClick={onDownload}>Download Code</button>
        <i className='icon'><IoSettings /></i>
      </div>
    </div>
  )
}

export default Navbar