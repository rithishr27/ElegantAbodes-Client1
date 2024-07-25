import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import {app} from '../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../Redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {

    const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('https://elegantabodes-server1.onrender.com/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: "",
        }),
        credentials : 'include',
      });
      const data = await res.json();
      console.log(data);
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('could not sign in with google', error);
    }
};

    return (
        <button onClick={handleGoogleClick} type='button' className='bg-red-500 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Continue With Google
        </button>
    )
}

export default OAuth
