import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import Userprofile from './components/Userprofile'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path='/register' element={<Register />} />
      <Route exact path='/login' element={<Login/>} />
      <Route exact path='/' element={<Home />} />
      <Route exact path='/userprofile' element={<Userprofile />} />
    </Routes>
  </BrowserRouter>
)

export default App
