import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';


const PlaceOrder = () => {

  const [method,setMethod]=useState('cod')
  const {navigate, getCartAmount, delivery_fee, cartItems, backendUrl, fetchCartData}=useContext(ShopContext)
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    phone: '',
  })

  const stripe = useStripe();
  const elements = useElements();

  const handlePlaceOrder = async () => {
    const subtotal = getCartAmount();
    const shipping = delivery_fee;
    const total = subtotal + shipping;
    if (method === 'stripe') {
      try {
        const { data } = await axios.post(`${backendUrl}/api/payment/create-payment-intent`, {
          amount: Math.round(total * 100),
        }, { withCredentials: true });

        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

        if (result.error) {
          toast.error(result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
          const response = await axios.post(backendUrl + '/api/order/placeorder', {
            deliveryDetails,
            subtotal,
            shipping,
            total,
            payment: 'Stripe',
          }, { withCredentials: true });

          if (response.data.success) {
            toast.success("Payment successful & order placed!");
            await fetchCartData();
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Payment failed");
      }
    } else {
      const paymentMethod = method === 'cod' ? 'Cash on Delivery' : method;
      try {
        const response = await axios.post(backendUrl + '/api/order/placeorder', {
          deliveryDetails,
          subtotal,
          shipping,
          total,
          payment: paymentMethod,
        }, { withCredentials: true });

        if (response.data.success) {
          toast.success(response.data.message);
          await fetchCartData();
          navigate('/orders');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Order failed");
      }
    }
  };


  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/*left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' value={deliveryDetails.firstName}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, firstName: e.target.value })} />
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' value={deliveryDetails.lastName}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, lastName: e.target.value })} />
        </div>
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' value={deliveryDetails.email}
          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, email: e.target.value })} />
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' value={deliveryDetails.street}
          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, street: e.target.value })} />
        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' value={deliveryDetails.city}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })} />
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' value={deliveryDetails.state}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value })} />
        </div>
        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Pin code' value={deliveryDetails.pincode}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, pincode: e.target.value })} />
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' value={deliveryDetails.country}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, country: e.target.value })} />
        </div>
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' value={deliveryDetails.phone}
          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })} />
      </div>
      {/*Right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'> 
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'> 
            <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='stripe'?'bg-green-400':''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod'?'bg-green-400':''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          {method === 'stripe' && (
            <div className='my-4 border p-4 rounded'>
              <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
            </div>
          )}

          <div className='w-full text-end mt-8'>
            <button onClick={handlePlaceOrder} className='bg-black text-white px-16 py-3 text-sm cursor-pointer'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
