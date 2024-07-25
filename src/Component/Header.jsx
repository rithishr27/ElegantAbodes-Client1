import React, { useEffect, useState } from 'react';
import {FaSearch} from 'react-icons/fa';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';

const Header = () => {

  const {currentUser} = useSelector((state) => state.user);
  const [searchTerm,setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e)=> {
      e.preventDefault();
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('searchTerm',searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/Search?${searchQuery}`);
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const urlSearchTerm = urlParams.get('searchTerm');
    console.log(urlSearchTerm);
    if(urlSearchTerm){
      setSearchTerm(urlSearchTerm);
    }
  },[location.search])

  return (
    <header className='bg-slate-200'> 
      <div className='flex justify-between item-center max-w-6xl mx-auto p-4'>
        <Link to={'/'}>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Elegant</span>
            <span className='text-slate-700'>Abodes</span>
          </h1>
        </Link>
        <form
        onSubmit={handleSubmit}
          className='bg-slate-100 p-1 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            defaultValue={searchTerm}
            className='bg-transparent focus:outline-none w-24 sm:w-64'  
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>
        <ul className='flex gap-4 text-slate-700 font-semibold'>
            <Link to={'/'}><li>Home</li></Link>
            <Link to={'/About'}><li>About</li></Link>
            <Link to={'/Profile'}>
              {
                currentUser ?
                  <img className='rounded-full h-7 w-7 object-cover'
                    src={currentUser.avatar} alt="Profile" 
                  />
                :
                  <li>SignIn</li>
              }
            </Link>
        </ul>
      </div>
    </header>
  )
}

export default Header
