import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { API_URL } from '../../config';
import axios from 'axios';
import defaultUserImage from '../../assets/images/default_pfp.png'

const Navbar = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const location = useLocation();
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.get(`${API_URL}/users/get_user_pfp`);
        console.log(response);
        setUserImage(response.data.image);
      } catch (error) {
        console.log('Error fetching user profile picture:', error);
      }
    };

    fetchUserProfilePicture();
  }, [token]);

  return (
    <div className='navbar-wrapper'>
        <h1 className='navbar-logo-text'>Recipo.</h1>
        <div className='navbar-links'>
            <Link className={location.pathname === '/' ? 'selected-navbar-link' : 'navbar-link'} to='/' >Discover</Link>
            <Link className={location.pathname === '/cookbook' ? 'selected-navbar-link' : 'navbar-link'} to='/cookbook' >Cookbook</Link>
            <Link className={location.pathname === '/create-recipe' ? 'selected-navbar-link' : 'navbar-link'} to='/create-recipe' >Create recipe</Link>
        </div>
        <Link className='navbar-link' to='/profile'>
          {<img src={userImage ? userImage : defaultUserImage} alt="Profile" className='navbar-profile-picture' />}
        </Link>
    </div>
  )
}

export default Navbar;
