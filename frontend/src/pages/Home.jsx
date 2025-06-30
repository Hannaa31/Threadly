import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import Bestseller from '../components/Bestseller'
import OurPolicies from '../components/OurPolicies'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <Bestseller />
      <OurPolicies />
      <NewsLetter />
    </div>
  )
}

export default Home
