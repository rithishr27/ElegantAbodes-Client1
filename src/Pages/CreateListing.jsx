import {getDownloadURL ,getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { FaRupeeSign } from 'react-icons/fa';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateListing = ()=> {

    const {currentUser} = useSelector((state) => state.user);
    const [files,setFiles] = useState([]);
    const [ImageUploadError,setImageUploadError] = useState(false);
    const [uploading , setUploading] = useState(false);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const navigate = useNavigate();

    const [formData,setFormData] = useState({
        imageUrls : [],
        name : "",
        description : "",
        address : "",
        type : "rent",
        bedrooms : 1,
        bathrooms : 1,
        regularPrice : 1000,
        discountPrice : 0,
        offer : false,
        parking : false,
        furnished : false,
    })

    // console.log(formData);

    const handleImageUpload = (e)=> {
        
        if(files.length>0 && files.length + formData.imageUrls.length < 7){
            setImageUploadError(false);
            setUploading(true);
            const promises = [];

            for(let i=0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            };

            Promise.all(promises).then((url) => {
                console.log(url);
                setFormData({...formData, imageUrls : formData.imageUrls.concat(url)})
                setUploading(false);
            })
            .catch((error) => {
                setImageUploadError("Image upload failed (2 mb max per image)");
                setUploading(false);
            })
        }
        else{
            setImageUploadError("You can only upload 6 images per listing");
            setUploading(false);
        }

    }

    const storeImage = (file)=> {
        return new Promise((resolve,reject) => {

            const storage = getStorage(app);
            const filename = new Date().getTime() + file.name;
            const storageRef = ref(storage,filename);
            const uploadTask = uploadBytesResumable(storageRef,file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`uploading ${Math.round(progress)}`);
                },
                (error) => {
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    resolve(downloadURL);
                  })
                }
              )

        })
    }

    const handleRemove = (index)=> {
        setFormData({
            ...formData,
            imageUrls : formData.imageUrls.filter((_,ind) => ind !== index),
        })
    }

    const handleChange = (e)=> {
        if(e.target.id === "rent" || e.target.id === "sale"){
            setFormData({
                ...formData,
                type : e.target.id,
            })
        }
        
        if(e.target.id === "parking" || e.target.id === "offer" || e.target.id === "furnished"){
            setFormData({
                ...formData,
                [e.target.id] : e.target.checked
            })
        }

        if(e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea"){
            setFormData({
                ...formData,
                [e.target.id] : e.target.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (formData.imageUrls.length < 1)
            return setError('You must upload at least one image');
          if (+formData.regularPrice < +formData.discountPrice)
            return setError('Discount price must be lower than regular price');
          setLoading(true);
          setError(false);
          const res = await fetch('https://elegantabodes-server1.onrender.com/api/listing/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              userRef: currentUser._id,
            }),
          });
          const data = await res.json();
          setLoading(false);
          if (data.success === false) {
            setError(data.message);
          }
          console.log(data);
          navigate(`/listing/${data._id}`);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
    }

    return(
        <>
            <main className='p-3 max-w-4xl mx-auto'>
                <h1 className="font-semibold text-3xl text-center my-7 ">Create a Listing</h1>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-3">

                    <div className="flex flex-col gap-4 flex-1 flex-wrap">
                        <input 
                            type="text" 
                            placeholder="Name" 
                            id="name" 
                            className="border rounded-lg p-3"
                            maxLength='62'
                            minLength='10'
                            required
                            onChange={handleChange}
                            value={formData.name}
                        />
                        <textarea 
                            type="textarea" 
                            placeholder="Description" 
                            id="description" 
                            className="border rounded-lg p-3"
                            required
                            onChange={handleChange}
                            value={formData.description}
                        />
                        <input 
                            type="text" 
                            placeholder="Address" 
                            id="address" 
                            className="border rounded-lg p-3"
                            required
                            onChange={handleChange}
                            value={formData.address}
                        />
                        <div className="flex flex-wrap gap-6">
                            <div className="flex gap-2">
                                <input 
                                    type="checkbox"
                                    id="sale"
                                    className="w-5" 
                                    onChange={handleChange}
                                    checked={formData.type==="sale"}
                                />
                                <span>Sale</span>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="checkbox"
                                    id="rent"
                                    className="w-5" 
                                    onChange={handleChange}
                                    checked={formData.type==="rent"}
                                />
                                <span>Rent</span>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="checkbox"
                                    id="parking"
                                    className="w-5" 
                                    onChange={handleChange}
                                />
                                <span>Parking</span>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="checkbox"
                                    id="furnished"
                                    className="w-5" 
                                    onChange={handleChange}
                                />
                                <span>Furnished</span>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="checkbox"
                                    id="offer"
                                    className="w-5" 
                                    onChange={handleChange}
                                />
                                <span>offer</span>
                            </div>
                        </div>
                        <div className='flex gap-4 flex-wrap'>
                            <div className="flex gap-2 items-center">
                                <input 
                                    type="number" 
                                    min='1'
                                    max='10'
                                    id="bedrooms"
                                    required
                                    className="border border-gray-300 rounded-lg p-3"
                                    onChange={handleChange}
                                    value={formData.bedrooms}
                                />
                                <span>BHK</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input 
                                    type="number" 
                                    min='1'
                                    max='10'
                                    id="bathrooms"
                                    required
                                    className="border border-gray-300 rounded-lg p-3"
                                    onChange={handleChange}
                                    value={formData.bathrooms}
                                />
                                <span>Bathrooms</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input 
                                    type="number" 
                                    min='1000'
                                    max='100000000'
                                    id="regularPrice"
                                    required
                                    className="border border-gray-300 rounded-lg p-3"
                                    onChange={handleChange}
                                    value={formData.regularPrice}
                                />
                                <div className='flex flex-col'>
                                    <p>Regular Price</p>
                                    <span className='inline-flex items-center text-xs'>(<FaRupeeSign/>/Month)</span>
                                </div>
                            </div>
                            {formData.offer && <div className="flex gap-2 items-center w-15">
                                <input 
                                    type="number" 
                                    min='0'
                                    max='100000000'
                                    id="discountPrice"
                                    required
                                    className="border border-gray-300 rounded-lg p-3"
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <div className='flex flex-col'>
                                    <p>Discount Price</p>
                                    <span className='inline-flex items-center text-xs'>(<FaRupeeSign/>/Month)</span>
                                </div>
                            </div>}
                        </div>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <p className='font-semibold'>Image: 
                            <span className='text-gray-500'>First image will be the cover (max:6)</span>
                        </p>
                        <div className='flex gap-4'>
                            <input 
                                onChange={(e)=>setFiles(e.target.files)}
                                type="file"
                                id='image'
                                multiple
                                accept='image/*'
                                className='p-3 border border-gray-300 w-full rounded' 
                            />
                            <button onClick={handleImageUpload} type='button' className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-xl disabled:opacity-85'>
                                {
                                    uploading ? "uploading" : "upload"
                                }
                            </button>
                        </div>
                        <div>
                            { 
                                ImageUploadError ? 
                                    <p className='text-red-600'>
                                        {ImageUploadError}
                                    </p> 
                                    :
                                formData.imageUrls.length>0 &&
                                formData.imageUrls.map((url,index) => {
                                    return <div key={url} className='flex justify-between p-3 border items-center rounded-lg mt-3'>
                                        <img src={url} alt="listing Image" className='w-20 object-cover'/>
                                        <button type='button' onClick={() => handleRemove(index)} className=' text-red-600 p-1 hover:shadow-xl disabled:opacity-100'>
                                            Delete
                                        </button>
                                    </div>
                                })
                            }
                        </div>
                        <button className='border bg-slate-500 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80'>
                            {loading ? "Listing" : "create listing"}
                        </button>
                        {error && <p className='text-red-600'>{error}</p>}
                    </div>

                </form>
                
            </main>
            
        </>
    );
}

export default CreateListing;