import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {backendUrl, currency} from '../App'
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';


const Orders = () => {
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const response = await axios.get(backendUrl+'/api/order/admin/allorders', {
                    withCredentials: true,
                });
                setOrders(response.data.orders);
                console.log("ORDERS DATA ===>", response.data.orders);
            } catch (error) {
                console.error('Error fetching admin orders:', error);
            }
        }
        fetchAllOrders()
    },[])

    const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/order/admin/update-status`,
        { orderId, status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Status updated');
        // Update local order state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      toast.error('Status update failed');
      console.error('Status update error:', error);
    }
  };


    return (
        <div>
            <h3>Order Page</h3>
            <div>
                {
                    orders.map((order)=>(
                        <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={order._id}>
                            <img className='w-12' src={assets.parcel_icon} alt="" />
                            <div>
                                <div>
                                {order.items.map((item,itemIndex)=>(
                                    <p className='py-0.5' key={itemIndex}>{item.itemData.name} x {item.itemData.quantity} <span>{item.itemData.size}</span></p>
                                ))}
                                </div>
                                <p className='mt-3 mb-2 font-medium'>{order.deliveryDetails.firstName+" "+order.deliveryDetails.lastName}</p>
                                <div>
                                <p>{order.deliveryDetails.street+", "}</p>
                                <p>{order.deliveryDetails.city+", "+order.deliveryDetails.state+", "+order.deliveryDetails.country+", "+order.deliveryDetails.pincode} </p>
                                </div>
                                <p>{order.deliveryDetails.phone}</p>
                                </div>
                                <div>
                                    <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                                    <p className='mt-3'>Method: {order.payment}</p>
                                    <p>Payment: {(order.payment === "Cash on Delivery"&&order.status!="Delivered") ? "Pending" : "Done"}</p>
                                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p className='text-sm sm:text-[15px]'>{currency} {order.total} </p>
                                <select onChange={(e) => handleStatusChange(order._id, e.target.value)} value={order.status} className='p-2 font-semibold'>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out for delivery">Out for delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Orders