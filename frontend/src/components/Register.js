import React, { useState } from 'react'
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/Register.css'

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [showErrMsg, setShowErrMsg] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [registerMsg, setRegisterMsg] = useState('')

  const handlerChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value})
  }

  const handlerForm = async(e) => {
    setIsLoading(true)
    e.preventDefault()
    let url = 'https://fullstack-tenant-management-system.onrender.com/register'

    if (userData.password === confirmPassword) {
      const options = {
        method: "POST",
        headers:{ 'Content-Type': 'application/json'},
        body: JSON.stringify(userData),
      }
      const response = await fetch(url, options)
      const data = await response.json() 
      setIsLoading(false)
  
      if (response.ok) {
        toast.success(data.msg)
        setIsRegister(true)
        setRegisterMsg(data.msg)
        setUserData({name: '', email: '', password: ''})
        setConfirmPassword('')
      } else {
        toast.error(data.msg)
        setErrMsg(data.msg)
        setShowErrMsg(true)
      }
    } else {
      toast.error("Password doesn't match")
      setErrMsg("Password doesn't match")
      setShowErrMsg(true)
    }
  }

  return (
    <div className='register-container'>
      <form className='register-form' onSubmit={handlerForm}>
        <h1 className='register-form-heading'>User Register</h1>
        <div className='register-input-card'>
          <label className='register-input-label' htmlFor='name'>Name</label>
          <input className='register-input' value={userData.name} onChange={handlerChange} id='name' type='text' name='name' placeholder='Enter your name' required />
        </div>
        <div className='register-input-card'>
          <label className='register-input-label' htmlFor='email'>Email</label>
          <input className='register-input' value={userData.email} onChange={handlerChange} id='email' type='email' name='email' placeholder='Enter your email' required />
        </div>
        <div className='register-input-card'>
          <label className='register-input-label' htmlFor='password'>Password</label>
          <input className='register-input' value={userData.password} onChange={handlerChange} id='password' type='password' name='password' placeholder='Enter your password' required />
        </div>
        <div className='register-input-card'>
          <label className='register-input-label' htmlFor='confirmPassword'>Confirm Password</label>
          <input className='register-input' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id='confirmPassword' type='password'  placeholder='Enter your confirm password' required />
        </div>
        <button className='register-form-btn' type='submit'>{isLoading ? 'Loading...' : 'Register'}</button>
        {showErrMsg && <p className='register-form-err-msg'>* {errMsg}</p>}
        {isRegister && <p className='register-form-isregister-msg'>* {registerMsg}</p>}
        <p className='register-form-login-here-para'>If you have an account ? <Link to='/login'>Login Here</Link></p>
      </form>
    </div>
  )
}

export default Register