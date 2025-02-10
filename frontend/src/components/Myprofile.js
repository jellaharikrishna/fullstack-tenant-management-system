import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import {Button} from 'react-bootstrap';
import Popup from 'reactjs-popup';
import { toast } from 'react-toastify';

import Navbar from './Navbar';
import '../styles/Myprofile.css'

const Myprofile = () => {
  const [userProfile, setUserProfile] = useState({})
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const token = Cookies.get('jwtToken')
  const url = 'https://fullstack-tenant-management-system.onrender.com/profile'

  const getUserProfile = async () => {
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    const response = await fetch(url, options)
    const data = await response.json()
    setUserProfile(data)
  }

  useEffect(() => {
    getUserProfile()
  }, [])
  

  const handlerSubmit = async (e) => {
    e.preventDefault()
    if (currentPassword.trim() === "" || currentPassword.length === 0){
      toast.warning("Please Enter valid current password")
    }else if(newPassword.trim() === "" || newPassword.length === 0){
      toast.warning("Please Enter valid New Password")
    }else if(currentPassword === newPassword){
      toast.warning("New Password can not be same as the Current Password.")
    }
    else{
      let updatedPassword = {
        currentPassword, 
        newPassword
      }
      const options = {
          method:"PUT",
          headers:{
              authorization:`Bear ${token}`,
              'Content-type':"application/json",
          },
          body: JSON.stringify(updatedPassword)
      }
      const response = await fetch(url, options)
      const data = await response.json()
      console.log(response)
      console.log(data)

      if (response.ok === true){
          toast.success("Password updated Successfully")
          setCurrentPassword("")
          setNewPassword("")
      }else{
          toast.error(data.msg)
      }
    }
  }


  return (
    <div>
      <Navbar />
      <h1 className='userprofile-info-heading'>My Profile Info</h1>
      <div className='userprofile-info-card'>
        <p className='userprofile-info-para'> <strong>User Id:</strong> {userProfile.id}</p>
        <p className='userprofile-info-para'> <strong>User Name:</strong> {userProfile.name}</p>
        <p className='userprofile-info-para'> <strong>User Email:</strong> {userProfile.email}</p>
        <div>
        <Popup modal trigger={<Button variant="primary" className="me-3">Change Password</Button>}>
            {close => (
                  <form onSubmit={handlerSubmit} className='changepassword-form'>
                    <h1 className='changepassword-heading'>Change Password</h1>
                      <div className='changepassword-input-card'>
                          <label className='changepassword-input-label' htmlFor='currentPassword'>Current Password</label>
                          <input onChange={(e) => setCurrentPassword(e.target.value)} className='changepassword-input' id='currentPassword' value={currentPassword} type='password' name='currentPassword' placeholder='Enter your current password' required />
                      </div>
                      <div className='changepassword-input-card'>
                          <label className='changepassword-input-label' htmlFor='newPassword'>New Password</label>
                          <input onChange={(e) => setNewPassword(e.target.value)} className='changepassword-input' id='newPassword' value={newPassword} type='password' name='newPassword' placeholder='Enter your new password' required/>
                      </div>
                      <div>
                      <Button variant="success" className="me-3" type='submit'>Update Password</Button>
                      <Button variant="primary" className="me-3" onClick={() => close()}>Close</Button>
                      </div>
                  </form>
            )}
        </Popup>
        <Button variant="danger" className="me-3">Delete Account</Button>
        </div>
    </div>
    </div>
  )
}

export default Myprofile