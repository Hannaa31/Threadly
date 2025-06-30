import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'

const Orders = () => {
  const {products,currency,getUserOrders,user}=useContext(ShopContext)
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      if(user){
        const data = await getUserOrders();
        setOrders(data);
      }
    };
    fetchOrders();
  }, [user]);


  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>
      <div>
        {
          orders.map((order, index) =>
            order.items.map((item, i) => (
            <div key={`${index}-${i}`} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                {item.itemData?.image?.[0] && (
                  <img className='w-16 sm:w-20' src={item.itemData.image[0]} alt="" />
                  )}
                  <div>
                    <p className='sm:text-base font-medium'>{item.itemData.name}</p>
                    <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                      <p className='text-lg'>{currency}{item.itemData.price}</p>
                      <p>Quantity: {item.itemData.quantity}</p>
                      <p>Size: {item.itemData.size}</p>
                    </div>
                    <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(order.createdAt).toLocaleDateString()}</span></p>
                  </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
              <div className='flex items-center gap-2'>
                <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                <p className='text-sm md:text-base'>{order.status}</p>
              </div>
              <button onClick={async () => {
                const data = await getUserOrders();
                setOrders(data);
                }} className='border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer'>Track Order</button>
              </div>
            </div>
          ))
        )
        }
      </div>
    </div>
  )
}

export default Orders
