import React, { useContext, useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import {ShopContext} from '../context/ShopContext'
import { assets } from '../assets/assets'
import StarRating from '../components/StarRating'
import RelatedProducts from '../components/RelatedProducts'

const Product = () => {
  const {currency,products,addToCart,addReview, getProductReviews, user}=useContext(ShopContext)
  const {productId}=useParams()
  const [productData,setProductData]=useState(null)
  const [image,setImage]=useState('')
  const [size,setSize]=useState('')
  const [rating,setRating]=useState(0)
  const [hover,setHover]=useState(0)
  const [comment, setComment] = useState('')
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false)

  
  useEffect(()=>{
    const current = products.find(item => item._id === productId);
    if (current) {
      setProductData(current);
      setImage(current.image[0]);
    }
  },[productId,products])


  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getProductReviews(productId);
      setReviews(data);
    };
    if (productId) fetchReviews();
  }, [productId]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
    const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  return productData?(
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*product data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/*product images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item,index)=>(
                <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>
        {/*Product info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          {/* Dynamic rating and count */}
          <div className='flex items-center gap-1 mt-2'>
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.round(avgRating) ? assets.star_icon : assets.star_dull_icon}
                className="w-3.5"
                alt=""
              />
            ))}
            <p className='pl-2'>({reviews.length})</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item,index)=>(
                <button onClick={()=>setSize(item)} className={`border cursor-pointer py-2 px-4 bg-gray-100 ${item===size?'border-orange-500':''}`} key={index}>{item}</button>
              ))}
            </div>
          </div>
          <button onClick={()=>addToCart(productData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col'>
            <p>100% Original Product.</p>
            <p>Pay on delivery might be available</p>
            <p>Easy 7 days returns and exchanges</p>
          </div>
        </div>
      </div>
    {/* Review Submission */}
      {user && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
          <StarRating rating={rating} setRating={setRating} hover={hover} setHover={setHover} comment={comment} setComment={setComment} />
          <button
            className="mt-2 bg-black text-white py-2 px-4 rounded cursor-pointer"
            onClick={async () => {
              const res = await addReview(productData._id, rating, comment);
              if (res?.success) {
                setComment('');
                setRating(0);
                const updated = await getProductReviews(productData._id);
                setReviews(updated);
              }
            }}
          >
            Submit Review
          </button>
        </div>
      )}

      {/* Customer Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
        <div className="flex flex-col gap-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <>
            {visibleReviews.map((review, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <strong>{review.userId?.name || 'Anonymous'}</strong>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={i < review.rating ? assets.star_icon : assets.star_dull_icon}
                        className="w-4"
                        alt=""
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}

            {reviews.length > 3 && (
                <button
                  className="text-blue-500 hover:underline text-sm mt-2 self-start"
                  onClick={() => setShowAllReviews(prev => !prev)}
                >
                  {showAllReviews ? 'Show Less' : `Show ${reviews.length - 3} More Review${reviews.length - 3 > 1 ? 's' : ''}`}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentProductId={productData._id} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product
