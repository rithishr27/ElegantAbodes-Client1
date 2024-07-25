import React, { useState } from 'react';
import axios from 'axios';
import {Link , useNavigate} from 'react-router-dom';
import OAuth from '../Component/OAuth';

const SignUp = () => {

  const [formData,setFormData] = useState({});
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }
  
  const handleSubmit = (e)=> {
    e.preventDefault();
    setLoading(true);
    axios.post('https://elegantabodes-server1.onrender.com/api/auth/signup',formData)
    .then((res)=> {
      setLoading(false);
      alert("Successfully SignedUp");
      navigate('/signin');
      console.log(res);
    })
    .catch((err) => {
      setLoading(false);
      setError(err.response.data.message);
      console.log(err);
    })
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center my-7'>
        SignUp
      </h1>
      <form 
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        <input 
          type="text" 
          placeholder='Username' 
          className='border p-3 rounded-lg' 
          id='username'
          onChange={handleChange}
        />
        
        <input 
          type="email" 
          placeholder='email' 
          className='border p-3 rounded-lg' 
          id='email'
          onChange={handleChange}
        />
        
        <input 
          type="password" 
          placeholder='password' 
          className='border p-3 rounded-lg' 
          id='password'
          onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-500 text-white rounded-lg p-3 uppercase'>
          {loading ? 'loading...' : 'SignUp'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-3 mt-4'>
        <h5>
          Already have an account? 
        </h5>
        <Link to={'/signin'}>
          SignIn  
       </Link>
      </div>
      {error && <p>{error}</p>}
    </div>
  )
}

export default SignUp
