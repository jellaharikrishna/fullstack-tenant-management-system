import React from 'react'
import Cookies from 'js-cookie'
import '../styles/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()

    const handlerLogout = () => {
        Cookies.remove('jwtToken')
        navigate('/login')
    }
     
  return (
    <nav className='navbar-container'>
        <div className='navbar-card'>
            <Link to='/' className='navbar-link'>Home</Link>
            <Link to='/myprofile' className='navbar-link'>My Profile</Link>
            <button className='navbar-btn' type='button' onClick={handlerLogout}>Logout</button>
        </div>
    </nav>
  )
}

export default Navbar