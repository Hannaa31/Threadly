import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import ProductItem from './ProductItem'
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const RelatedProducts = ({category,subCategory,currentProductId}) => {
    const [related,setRelated]=useState([])
    const {backendUrl}=useContext(ShopContext)

    useEffect(()=>{
        const fetchRelatedProducts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/related`, {
          params: {
            category,
            subCategory,
            exclude: currentProductId
          }
        });
        setRelated(res.data);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    fetchRelatedProducts();
    },[category, subCategory, currentProductId])
  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item,index)=>(
            <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
