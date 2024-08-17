import React, { useState } from 'react';
import { API_URL } from '../../config';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';

const Profile = () => {
  const [imageFile, setImageFile] = useState();
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));

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
      'userPicture': imageFile,
    }

    try {
      console.log('sending request')
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(`${API_URL}/users/edit_user`, user);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }

  return (
    <>
      <Navbar />

      <div className='discover-page-wrapper'>
        <div className='all-recipes-wrapper'>
          <div className='all-recipes-heading-wrapper'>
            <h2 className='all-recipes-heading'>Profile</h2>
            <div className='profile-wrapper'>
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button onClick={() => handleSubmit()}>upload image</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile