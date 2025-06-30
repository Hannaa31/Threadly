import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetter from '../components/NewsLetter'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>At Threadly, we believe that fashion is more than just clothing—it's a form of self-expression. Born out of a passion for creativity, comfort, and culture, Threadly is your destination for trend-inspired, quality-crafted apparel that fits every style and story. We blend timeless design with modern sensibilities to bring you pieces that are as versatile as they are vibrant.</p>
        <p>We prioritize comfort, craftsmanship, and conscious choices—bringing you garments that look great and feel even better. Join us on our journey to redefine everyday fashion, one thread at a time.</p>
        <b>Our Mission</b>
        <p>Our mission at Threadly is to redefine everyday fashion by offering thoughtfully designed, accessible clothing that empowers self-expression. We are committed to delivering high-quality, affordable pieces while embracing ethical practices, inclusive sizing, and customer-first innovation. With every thread, we aim to inspire confidence, celebrate individuality, and build a community where everyone belongs.</p>
        </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border border-gray-400 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
        </div>
        <div className='border border-gray-400 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
        </div>
        <div className='border border-gray-400 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
        </div>
      </div>
      <NewsLetter />
    </div>
  )
}

export default About
