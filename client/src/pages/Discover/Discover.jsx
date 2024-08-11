import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import './Discover.css';
import { API_URL } from '../../config';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { MdStar } from 'react-icons/md';

const Discover = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = token;
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
          <div className='all-recipes-heading-wrapper'>
            <h2 className='all-recipes-heading'>All Recipes</h2>
            <div className='recipe-search-wrapper'>
              <div className='recipe-search-container'>
                <input
                  type="text"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  className='recipe-search-input'
                  placeholder='Input recipe name'
                />
                <CiSearch  className='recipe-search-icon'/>
              </div>
              <button className='recipe-search-button'>Search</button>
            </div>
          </div>
          <div className='recipes-grid-container'>
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <button key={recipe._id} className='recipe-card' type="button" onClick={() => navigate(`/recipe/${recipe._id}`)}>
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
                    <MdStar className='star-visible' size={30} />
                    <MdStar className={recipe.rating >= 2 ? 'star-visible' : 'star-hidden'} size={30} />
                    <MdStar className={recipe.rating >= 3 ? 'star-visible' : 'star-hidden'} size={30} />
                    <MdStar className={recipe.rating >= 4 ? 'star-visible' : 'star-hidden'} size={30} />
                    <MdStar className={recipe.rating >= 5 ? 'star-visible' : 'star-hidden'} size={30} />
                  </div>
                  <p className='recipe-author'>By: <u>{`${recipe.author}`}</u></p>
                  
                </button>
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
