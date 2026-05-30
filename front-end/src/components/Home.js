import React from 'react'
import "./Home.css"
import Page1 from './Page1'
import Page2 from './Page2'
import Feedback from './Feedback'
import Footer from './Footer'
function Home() {
  return (
    <div className='home-top'>
        <div className='back'></div>
        <Page1></Page1>
        <Page2></Page2>
        <Feedback></Feedback>
        <Footer/>

    </div>
  )
}

export default Home