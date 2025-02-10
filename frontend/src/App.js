import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import Myprofile from './components/Myprofile'


const App = () => (
  <>
  <ToastContainer position="top-right" autoClose={5000} />
  <BrowserRouter>
    <Routes>
      <Route exact path='/register' element={<Register />} />
      <Route exact path='/login' element={<Login/>} />
      <Route exact path='/' element={<Home />} />
      <Route exact path='/myprofile' element={<Myprofile />} />
    </Routes>
  </BrowserRouter>
  </>
)

export default App
