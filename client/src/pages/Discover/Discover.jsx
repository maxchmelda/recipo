import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import './Discover.css';
import { API_URL } from '../../config';

const Discover = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${API_URL}/recipes/all`);
        if (response.data.ok) {
          setRecipes(response.data.recipes);
        } else {
          console.error('Failed to fetch recipes:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <>
      <Navbar />

      <div className='discover-page-wrapper'>
        <div className='all-recipes-wrapper'>
          <h2>All Recipes</h2>
          <div className='recipes-wrapper'>
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div key={recipe._id} className='recipe-card'>
                  <h3>{recipe.name}</h3> {/* Display recipe name */}
                  <p>{recipe.description}</p> {/* Display recipe description */}
                  {recipe.image && (
                    <img
                      src={recipe.image} // Use base64 string as the image source
                      alt={recipe.name} // Alt text for the image
                      className='recipe-image' // Add a class for styling
                    />
                  )}
                  {!recipe.image && (
                    <img
                      src={`${API_URL}/images/default_recipe_image.svg`} // URL to the default image
                      alt="Default Recipe" // Alt text for the default image
                      className='recipe-image' // Add a class for styling
                    />
                  )}
                  {/* Add more recipe details as needed */}
                </div>
              ))
            ) : (
              <p>No recipes found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Discover;
