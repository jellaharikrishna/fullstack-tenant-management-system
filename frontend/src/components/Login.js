import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from "js-cookie"

import '../styles/Login.css'

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  })
  const [errMsg, setErrMsg] = useState('')
  const [showErrMsg, setShowErrMsg] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate =  useNavigate()

  const handlerChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value})
  }

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set('jwtToken', jwtToken, {expires: 30})
    navigate("/")    
  }

  const onSubmitFailure = (msg) => {
    toast.error(`${msg}`);
    setErrMsg(msg)
    setShowErrMsg(true)
  }


  const handlerForm = async (e) => {
    setIsLoading(true)
    e.preventDefault()

    let url = 'https://fullstack-tenant-management-system.onrender.com/login'

    const options = {
      method: "POST",
      headers:{ 'Content-Type': 'application/json'},
      body: JSON.stringify(userData),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    setIsLoading(false)

    if (response.ok) {
      onSubmitSuccess(data.jwtToken)
    } else {
      onSubmitFailure(data.msg)
    }
   
  }

  const token = Cookies.get('jwtToken')

  if (token !== undefined){
     return navigate('/')
  }

  return (
    <div className='login-container'>
      <form onSubmit={handlerForm} className='login-form'>
        <h1 className='login-form-heading'>User Login</h1>
        <div className='login-input-card'>
          <label htmlFor='email' className='login-input-label'>Email</label>
          <input className='login-input' value={userData.email} onChange={handlerChange} id='email' type='email' name='email' placeholder='Enter your email' required />
        </div>
        <div className='login-input-card'>
          <label htmlFor='password' className='login-input-label'>Password</label>
          <input className='login-input' value={userData.password} onChange={handlerChange} id='password' type='password' name='password' placeholder='Enter your password' required />
        </div>
        <button className='login-form-btn' type='submit'>{isLoading ? 'Loading...' : 'Login'}</button>
        {showErrMsg && <p className='login-form-err-msg'>* {errMsg}</p>}
        <p className='login-form-register-here-para'>If you don't have an account ? <Link to='/register'>Register Here</Link></p>
      </form>
    </div>
  )
}

export default Login