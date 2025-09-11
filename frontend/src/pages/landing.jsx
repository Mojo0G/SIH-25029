import React, { useEffect } from 'react'
import { Hero } from '../components/hero'
import Features01Page from '../components/features'
import AboutUs from '../components/aboutUs'
import ContactUs from '../components/contactUs'


function Landing() {
  
  useEffect(() => {
   
    console.log("Home section:", document.getElementById('home'));
    console.log("Features section:", document.getElementById('features'));
    console.log("About section:", document.getElementById('about'));
    console.log("Contact section:", document.getElementById('contact'));
    
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            window.scrollTo({
              top: element.offsetTop - 80,
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    };

    // Handle hash on initial load
    handleHashChange();
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
   <div>
    {/* home */}
    <section id="home" className="scroll-mt-20 min-h-screen">
      <Hero/>
    </section>
    {/* features */}
    <section id="features" className="scroll-mt-20 min-h-screen">
      <Features01Page/>
    </section>

    {/* aboutus */}
    <section id="about" className="scroll-mt-20 min-h-screen">
      <AboutUs/>
    </section>
    {/* contactus */}
    <section id="contact" className="scroll-mt-20 min-h-screen">
      <ContactUs/>
    </section>

   </div>

  )
}

export default Landing