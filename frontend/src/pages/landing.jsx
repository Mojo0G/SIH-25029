import React from 'react'
import { Hero } from '../components/hero'
import Features01Page from '../components/features'
import AboutUs from '../components/aboutUs'
import ContactUs from '../components/contactUs'


function Landing() {
  return (
   <div>
    {/* home */}
    <Hero/>
    {/* features */}
    <Features01Page/>


    {/* aboutus */}
    <AboutUs/>
    {/* contactus */}
    <ContactUs/>
    

   </div>

  )
}

export default Landing