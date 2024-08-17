import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import './Cookbook.css';
import axios from 'axios';
import { API_URL } from '../../config';
import defaultRecipeImage from '../../assets/images/default_recipe_image.svg';
import { MdStar } from "react-icons/md";


const Cookbook = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const [recipes, setRecipes] = useState();

  const fetchRecipes = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.get(`${API_URL}/recipes/bookmarked`);
      console.log(response);
      setRecipes(response.data.data);
    } catch (error) {
      console.log('Error fetching user profile picture:', error);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.get(`${API_URL}/recipes/bookmarked`);
        console.log(response);
        setRecipes(response.data.data);
      } catch (error) {
        console.log('Error fetching user profile picture:', error);
      }
    };

    fetchRecipes();
  }, [token]);

  const handleRemoveFromCB = async (id) => {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(`${API_URL}/recipes/toggle-in-cb`, { 'recipeId': id });
      if (response.data.ok) {
        fetchRecipes();
      } else {
        console.log('Failed to update cookbook:', response.data.message);
      }
    } catch (error) {
      console.log('Error updating cookbook:', error);
    }
  }

  return (
    <>
      <Navbar />

      <div className='discover-page-wrapper'>
        <div className='all-recipes-wrapper'>
          <div className='all-recipes-heading-wrapper'>
            <h2 className='all-recipes-heading'>Your Cookbook</h2>
          </div>

          <div className='recipes-grid-container'>
            {recipes ? (
              recipes.map((recipe) => (
                <div className='recipe-card' key={recipe._id}>
                  <button className='recipe-button'  type="button" onClick={() => navigate(`/recipe/${recipe._id}`)}>
                    <h3>{recipe.name}</h3>
                    {recipe.image && (
                      <div className='recipe-image-container'>
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className='recipe-image'
                        />
                      </div>
                    )}
                    {!recipe.image && (
                      <div className='recipe-image-container'>
                        <img
                          src={`assets/images/default_recipe_image.svg`}
                          alt="Default Recipe"
                          className='recipe-image'
                        />
                      </div>
                    )}
                    <div className='review-done-stars-container'>
                      <MdStar className={recipe.rating >= 1 ? 'star-visible' : 'star-gray'} size={30} />
                      <MdStar className={recipe.rating >= 2 ? 'star-visible' : 'star-gray'} size={30} />
                      <MdStar className={recipe.rating >= 3 ? 'star-visible' : 'star-gray'} size={30} />
                      <MdStar className={recipe.rating >= 4 ? 'star-visible' : 'star-gray'} size={30} />
                      <MdStar className={recipe.rating >= 5 ? 'star-visible' : 'star-gray'} size={30} />
                    </div>
                    <p className='recipe-author'>By: <u>{`${recipe.author}`}</u></p>
                  </button>
                  <button className='add-recipe-cb' onClick={() => handleRemoveFromCB(recipe._id)}>Remove from cookbook</button>        
                </div>
              ))
            ) : (
              <p>No recipes found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Cookbook