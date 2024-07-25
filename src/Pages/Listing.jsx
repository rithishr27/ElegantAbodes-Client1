import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import 'swiper/swiper-bundle.css';
import {Navigation} from 'swiper/modules'
import {useSelector} from 'react-redux'
import { FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
    FaRupeeSign    
} from 'react-icons/fa';
import Contact from "../Component/Contact";

const Listing = ()=> {

    SwiperCore.use([Navigation]);
    const params = useParams();
    const {currentUser} = useSelector((state) => state.user);
    const [dataError, setDataError] = useState(false);
    const [loading,setLoading] = useState(false);
    const [copied,setCopied] = useState(false);
    const [contact,setContact] = useState(false);
    const [message,setMessage] = useState("");
    const [formData,setFormData] = useState(null)

    useEffect(()=> {
        const fetchData = async() => {
            try {
                setLoading(true);
                const res = await fetch(`https://elegantabodes-server.onrender.com/api/listing/getData/${params.id}`);
                const data = await res.json(); 
                setFormData(data);
                if(data.success===false){
                    setDataError(true);
                }
                setLoading(false);
                console.log(data);
            } catch (error) {
                setDataError(true);
            }
        }
        fetchData();
    },[])

    // console.log(formData);
    console.log(message);

    return(
        <main>
            <div className="flex justify-center font-semibold">
                {dataError && <h2 className="mt-3">Something Went Wrong...!!!</h2>}
                {loading && <h2 className="mt-3">Loading...</h2>}
            </div>
            {formData && !loading && !dataError && (
                <div>
                    <Swiper navigation>
                        {formData.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className='h-[450px] overflow-hidden flex items-center justify-center'>
                                    <div
                                        className='w-full h-full'
                                        style={{
                                            background: `url(${url}) center center no-repeat`,
                                            backgroundSize: 'cover',
                                        }}
                                    ></div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare
                        className='text-slate-500'
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                            setCopied(false);
                            }, 2000);
                        }}
                        />
                    </div>
                    {copied && (
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                        Link copied!
                        </p>
                    )}
                    <div className="flex flex-col gap-y-5 max-w-4xl mx-auto p-3 mt-6">
                        <div className="w-full">
                            <p className="font-semibold text-2xl flex items-center">
                                {formData.name} - <FaRupeeSign/> 
                                {formData.regularPrice}
                            </p>
                            <p className="flex gap-2 mt-7 items-center text-sm text-slate-600">
                                <FaMapMarkerAlt className="text-green-600"/> 
                                {formData.address}
                            </p>
                            <div className="flex gap-2 mt-3">
                                <p className='bg-red-700 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                    {formData.type === 'rent' ? 'For Rent' : 'For Sale'}
                                </p>
                                {formData.offer && (
                                    <p className='flex items-center justify-center bg-green-700 w-full max-w-[200px] text-white text-center p-1 rounded-md '>
                                    <FaRupeeSign/>{+formData.regularPrice - +formData.discountPrice} OFF
                                    </p>
                                )}
                            </div>
                            <p className="mt-4">
                                <span className="font-semibold">Description</span> - {formData.description}
                            </p>
                            <div className="flex gap-3 mt-3">
                                <p className="flex items-center gap-1 text-green-800"><FaBed/>{formData.bedrooms} BHK</p>
                                <p className="flex items-center gap-1 text-green-800"><FaBath/>{formData.bathrooms} Baths</p>
                                {formData.parking && <p className="flex items-center gap-1 text-green-800"><FaParking/>Parking</p>}
                                {formData.furnished && <p className="flex items-center gap-1 text-green-800"><FaChair/>Furnished</p>}
                            </div>
                        </div>
                        {currentUser && formData.userRef !== currentUser._id && !contact && (
                            <button
                                onClick={() => setContact(true)}
                                className='bg-slate-600 text-white rounded-lg uppercase hover:opacity-95 p-3 w-1/2'
                            >
                                Contact landlord
                            </button>
                        )}
                        {contact && <Contact listing={formData} />}
                    </div>
                </div>
            )}
        </main>
    )
}

export default Listing
