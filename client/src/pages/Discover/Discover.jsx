import { React, useState } from 'react';
import axios from 'axios';

const Discover = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));

  const URL = 'http://localhost:3040'; // Adjust to match your server's address

  const handleClick = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.get(`${URL}/recipes/all`);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  return (
    <button onClick={() => handleClick()}>Home</button>
  )
}

export default Discover