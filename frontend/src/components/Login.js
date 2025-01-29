import React, { useState } from 'react'
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from "js-cookie"

import '../styles/Login.css'

let url = 'https://fullstack-tenant-management-system.onrender.com'

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  })
  const [errMsg, setErrMsg] = useState('')
  const [showErrMsg, setShowErrMsg] = useState(false)

  const handlerChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value})
  }

  const onSubmitFailure = (err) => {
    console.log(err)
    // setErrMsg(err)
    // setShowErrMsg(true)
  }

  const onSubmitSuccess = (jwtToken) => {
    console.log(jwtToken)
  }


  const loginFormSubmit = async(e) => {
    e.preventDefault()
   try {
    const options = {
      method: "POST",
      headers:{ 'Content-Type': 'application/json'},
      body: JSON.stringify(userData),
    }
    const response = await fetch(`${url}/login`, options)
    const data = await response.json() 
    console.log(response)
    console.log(data)

    // if (data) {
    //   onSubmitSuccess(data.jwtToken)
    // } else {
    //   onSubmitFailure(data.err)
    // }
   
   } catch (e) {
    console.log(`login error message: ${e}`)
   }
  }



  return (
    <div>
      <form onSubmit={loginFormSubmit}>
        <div>
          <label htmlFor='email'>Email</label>
          <input value={userData.email} onChange={handlerChange} id='email' type='email' name='email' placeholder='Enter your email' required />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input value={userData.password} onChange={handlerChange} id='password' type='password' name='password' placeholder='Enter your password' required />
        </div>
        <button type='submit'>Login</button>
        <p>If you don't have account <Link to='/register'>Register Here</Link></p>
      </form>
    </div>
  )
}

export default Login