import React, { Profiler } from 'react';
import {BrowserRouter , Routes, Route} from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import Profile from './Pages/Profile'
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Header from './Component/Header';
import PrivateRouter from './Component/PrivateRouter';
import CreateListing from './Pages/CreateListing';
import Listing from './Pages/Listing';
import UpdateListing from './Pages/UpdateListing';
import Search from './Pages/SearchList';

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/About' element={<About/>} />
        <Route element={<PrivateRouter/>}>
          <Route path='/Profile' element={<Profile/>} />
          <Route path='/CreateListing' element={<CreateListing/>} />
          <Route path='/UpdateListing/:id' element={<UpdateListing/>}/>
        </Route>
        <Route path='/SignIn' element={<SignIn/>} />
        <Route path='/Signup' element={<SignUp/>} />
        <Route path='/listing/:id' element={<Listing/>}/>
        <Route path='/Search' element={<Search/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
