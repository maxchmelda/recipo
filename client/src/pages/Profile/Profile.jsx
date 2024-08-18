import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import './Profile.css';
import Footer from '../../components/Footer/Footer';
import DefaultPfp from '../../assets/images/default_pfp.png'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [imageFile, setImageFile] = useState('');
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.get(`${API_URL}/users/user`);
      console.log(response);
      setUsername(response.data.username || '');
      setImageFile(response.data.image || DefaultPfp);
    } catch (error) {
      console.log('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const user = {
      'username': username,
      'image': imageFile
    };

    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(`${API_URL}/users/edit_user`, user);
      console.log(response.data);
      if (response.data.ok) {
        fetchUser();
        navigate(-1);
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <>
      <Navbar />

      <div className='discover-page-wrapper'>
        <div className='all-recipes-wrapper'>
          <div className='all-recipes-heading-wrapper'>
            <h2 className='all-recipes-heading'>Profile</h2>
          </div>
          <div className='profile-wrapper'>
            <div className='change-image-pfp-wrapper'>
              <h2>Profile picture</h2>
              <img 
                src={imageFile || 'path/to/default-profile-image.svg'} 
                alt="Profile Preview" 
                className='profile-image-preview'
              />
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div>
              <h2>Username</h2>
              <input 
                type="text" 
                value={username} 
                className='username-input'
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>

            <button className='add-recipe-cb' onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Profile;
