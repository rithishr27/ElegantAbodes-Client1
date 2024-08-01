import { onLog } from 'firebase/app';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { app } from '../firebase';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { BsPencilSquare } from "react-icons/bs";
import axios from 'axios';
import {  
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure,
  deleteUserStart, 
  deleteUserSuccess, 
  deleteUserFailure,
  signOutUserStart, 
} from '../Redux/user/userSlice.js'
import { Link, useSearchParams } from 'react-router-dom';

const Profile = () => {

  const {currentUser} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePrec, setFilePerc] = useState(0);
  const [fileUploadError , setFileUploadError] = useState(false);
  const [formData , setFormData] = useState({id : currentUser._id});
  const [Listing,setListing] = useState([]);
  const [show,setShow] = useState(false);
  const [listingError,setListingError] = useState(false);
  const [confirmDelete,setConfirmDelete] = useState(false);
  const [edit,setEdit] = useState(false);
  const dispatch = useDispatch();

  console.log(formData);
  // console.log(filePrec);
  // console.log(fileUploadError);

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload = (file)=> {

    setFileUploadError(false);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef , file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          setFormData({...formData, avatar : downloadURL});
        })
      }
    )
  }

  const handleUpdate = async (e)=> {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`https://elegantabodes-server.onrender.com/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }
  

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`https://elegantabodes-server.onrender.com/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('https://elegantabodes-server.onrender.com/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleChange = (e)=> {
    setFormData({
      ...formData, 
      [e.target.id] : e.target.value,
    })
  }

  const showListing = ()=> {
    setShow(!show);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://elegantabodes-server.onrender.com/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        setListing(data);
        if (data.length < 1) {
          setListingError("You never created a list");
        }
        console.log(data);
      } catch (error) {
        setListingError(error.message);
      }
    };

    fetchData();
  }, [currentUser]);

  // console.log(Listing);

  const handleDeleteListing = async(index)=> {
    try {
      const listingItem = Listing.find((_, ind) => ind === index);
      const id = listingItem ? listingItem._id : null;

      if(id){
        const res = fetch(`https://elegantabodes-server.onrender.com/api/listing/deleteData/${id}`,{
          method : 'DELETE',
        })
      }
      // const data = await res.json();
      // if(data.success === false){
      //   console.log(data.message);
      // }
      setListing(
        (pre) => pre.filter((list) => list._id!==id)
      )
      console.log(Listing);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
      <div className='p-3 max-w-lg mx-auto relative'>
        <h1 className='text-3xl font-semibold text-center my-5'>Profile</h1>
        {!edit && <div className='absolute right-5 flex items-center gap-1 cursor-pointer' onClick={() => setEdit(true)}>
          <BsPencilSquare/>
          <p >Edit</p>
        </div>}
        {edit && <div className='absolute right-5 flex items-center gap-1 cursor-pointer text-red-500' onClick={() => setEdit(false)}>Cancel</div>
        }
        <form 
          className='flex flex-col'
          onSubmit={handleUpdate}
        >
          <input onChange={(e) => setFile(e.target.files[0])} type="file"  ref={fileRef} hidden accept='image/*'/>
          <img onClick={() => fileRef.current.click()} className='rounded-full h-20 w-20 object-cover self-center mt-2' 
            src={formData.avatar || currentUser.avatar} alt="Img" 
          />

          <p className='text-center'>
            {fileUploadError ?
              <span className='text-red-700'>Error Image Upload</span>
            :
              filePrec > 0 && filePrec < 100 ?
                <span className='text-slate-700'>Uploading {filePrec}%</span>
              :
                filePrec === 100 ?
                  <span className='text-green-700'>Image Successfully Uploaded!!</span>
                : 
                  ""
            }
          </p>

          <input 
            type="text" 
            placeholder='username' 
            className='border p-3 rounded-lg mt-4' 
            id='username'
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
          <input 
            type="email" 
            placeholder='email' 
            className='border p-3 rounded-lg mt-4'
            id='email'
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <input 
            type="password" 
            placeholder='password' 
            className='border p-3 rounded-lg mt-4'
            id='password'
            onChange={handleChange} 
          />

          {edit && <button className='border p-3 uppercase rounded-lg mt-4 bg-slate-600 text-white hover:opacity-95 hover:disabled:opacity-80'>
            Update
          </button>}

          <Link to={'/CreateListing'} className='border p-3 text-center uppercase rounded-lg mt-4 bg-green-600 text-white hover:opacity-95 hover:disabled:opacity-80'>
            Create Listing
          </Link>

        </form>

        

        <div className='flex justify-between mt-5'>

          <span onClick={() => setConfirmDelete(!confirmDelete)} className='text-red-600 cursor-pointer'>Delete Account</span>
          <span onClick={handleSignOut} className='text-red-600 cursor-pointer'>Sign Out</span>
          
        </div>
        <div className='flex justify-center'>
          <span onClick={showListing} className='text-green-600 cursor-pointer w-fit'>Show Listing</span>
        </div>

        <div className='flex flex-col mt-3'>
          {show ? (
            listingError ? (
              <span className='text-red-600'>{listingError}</span>
            ) : (
              Listing.length > 0 ? (
                <div>
                  <h2 className='font-semibold uppercase flex justify-center my-5'>your listing</h2>
                  {Listing.map((data, index) => (
                    <div key={index} className='flex justify-evenly items-center border rounded-lg h-24 p-4 gap-2 mt-2'>
                      <div className='w-24 h-24 overflow-hidden p-2'>
                        <img className='w-full h-full object-cover' src={data.imageUrls[0]} alt="img" />
                      </div>
                      <Link to={`/listing/${data._id}`} className='mx-4 flex-grow font-semibold'>{data.name}</Link>
                      <div className='flex flex-col gap-y-2'>
                        <button className='text-red-600' onClick={() => handleDeleteListing(index)}>Delete</button>
                        <Link to={`/UpdateListing/${data._id}`} className='text-green-600'>Edit</Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span>No listings available</span>
              )
            )
          ) : (
            ""
          )}
        </div>

        {confirmDelete && 
        <div 
          className='fixed inset-0 flex justify-center items-center bg-[rgba(208,208,225,0.16)] backdrop-blur-[1px]'
        >
          <div className="bg-amber-50 p-2 px-4 rounded-lg font-semibold shadow-lg max-w-sm  flex flex-col items-center">
            <p>Are you sure, Do you want to delete <br /> your account ?</p>
            <div className='flex justify-around gap-16 mt-3'>
              <button onClick={handleDeleteUser} 
                className='bg-red-600 text-white px-2 rounded-lg hover:shadow-lg hover:opacity-90'
              >
                Yes
              </button>
              <button onClick={() => setConfirmDelete(!confirmDelete)} 
                className='bg-green-600 text-white px-2 rounded-lg hover:shadow-lg hover:opacity-90'
              >
                No
              </button>
            </div>
          </div>
        </div>}
    </div>
    
  )
}

export default Profile
