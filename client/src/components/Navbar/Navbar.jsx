import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className='navbar-wrapper'>
        <h1 className='navbar-logo-text'>Recipo</h1>
        <div className='navbar-links'>
            <Link to='/' >Discover</Link>
            <Link to='/cookbook' >Cookbook</Link>
            <Link to='/about-us' >About us</Link>
            <Link to='/create-recipe' >Create recipe</Link>
        </div>
        <Link to='/profile'></Link>
    </div>
  )
}

export default Navbar