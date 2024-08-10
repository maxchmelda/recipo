import { React, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import './Discover.css'

const Discover = () => {
  return (
    <>
      <Navbar />

      <div className='discover-page-wrapper'>
        <div className='all-recipes-wrapper'>
          <h2>All recipes</h2>
          <div className='recipes-wrapper'>
              {/* Recipes map */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Discover