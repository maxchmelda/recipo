import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useParams } from 'react-router-dom';
import './Recipe.css';
import axios from 'axios';
import { API_URL } from '../../config';
import defaultRecipeImage from '../../assets/images/default_recipe_image.svg';
import { MdStar } from "react-icons/md";


const Recipe = () => {
  const { recipeId } = useParams();
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const [recipe, setRecipe] = useState();
  const [reviewToAdd, setReviewToAdd] = useState("");
  const [stars, setStars] = useState(1);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.get(`${API_URL}/recipes/get-recipe`, {
          params: {
            'recipeId': recipeId,
          }
        });
        console.log(response);
        setRecipe(response.data.recipe);
      } catch (error) {
        console.log('Error fetching user profile picture:', error);
      }
    };

    fetchRecipe();
  }, [token]);

  const handleReviewSubmit = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(`${API_URL}/recipes/add-review`, { recipeId: recipeId, review: reviewToAdd, stars: stars });
      console.log(response);
      setReviewToAdd("");
      setStars(1);
      fetchRecipe();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar />
      
      { recipe ?
        <div className='discover-page-wrapper'>
          <div className='recipe-content-wrapper'>
            <h2 className='recipe-name-heading'>{recipe.name}</h2>

            <div className='recipe-description'>
              <p>{recipe.description}</p>
            </div>

            <div className='recipe-image'>
              <img alt="recipe image" src={recipe.image ? recipe.image : defaultRecipeImage} />
            </div>

            <div className='recipe-cooking-times'>
              <p><strong>Total: </strong>
                {`${recipe.times.total.hours ? recipe.times.total.hours : 0}h ${recipe.times.total.minutes ? recipe.times.total.minutes : 0}m`}
              </p>
              <p><strong>Prep: </strong>
                {`${recipe.times.prep.hours ? recipe.times.prep.hours : 0}h ${recipe.times.prep.minutes ? recipe.times.prep.minutes : 0}m`}
              </p>
              <p><strong>Cook: </strong>
                {`${recipe.times.cook.hours ? recipe.times.cook.hours : 0}h ${recipe.times.cook.minutes ? recipe.times.cook.minutes : 0}m`}
              </p>
            </div>

            <div className='ingredients-wrapper'>
              <h2>Ingredients</h2>
              <div className='ingredients-container'>
                {recipe.ingredients.map(entry => {
                  return (
                    <div className='ingredient-row' key={entry._id}>
                      <span><strong>{entry.ingredient}</strong></span>
                      <span>{entry.amount}{entry.unit}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className='steps-wrapper'>
              <h1 className='instructions-heading'>Instructions</h1>
              {recipe.steps.map(step => {
                return (
                  <div className='step-container' key={step._id}>
                    <h2 className='step-heading'>Step {step.step}</h2>
                    <p className='step-directions'>{step.directions}</p>
                  </div>
                )
              })}
            </div>

            <div className="tags-wrapper">
              <h1>Tags</h1>
              <div className='tags-container'>
                {recipe.tags.map((tag, index) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      className={'create-tag'}
                    >
                    {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className='reviews-wrapper'>
              <h1>Reviews</h1>
              <div className='create-review'>
                <div className='review-stars-container'>
                  <button className='star-button' onClick={() => setStars(1)}>
                    <MdStar className='star-selected' size={30} />
                  </button>
                  <button className='star-button' onClick={() => setStars(2)}>
                    <MdStar className={stars >= 2 ? 'star-selected' : 'star'} size={30} />
                  </button>
                  <button className='star-button' onClick={() => setStars(3)}>
                    <MdStar className={stars >= 3 ? 'star-selected' : 'star'} size={30} />
                  </button>
                  <button className='star-button' onClick={() => setStars(4)}>
                    <MdStar className={stars >= 4 ? 'star-selected' : 'star'} size={30} />
                  </button>
                  <button className='star-button' onClick={() => setStars(5)}>
                    <MdStar className={stars >= 5 ? 'star-selected' : 'star'} size={30} />
                  </button>
                </div>
                <textarea value={reviewToAdd} onChange={(e) => setReviewToAdd(e.target.value)}/>
                <button className='add-review-btn' onClick={() => handleReviewSubmit()}>Add review</button>
              </div>
              <div className='reviews-container'>
                {recipe.reviews.map(entry => {
                  return (
                    <div className='review-card' key={entry._id}>
                      <h3>{entry.userName}</h3>
                      <div className='review-done-stars-container'>
                          <MdStar className='star-visible' size={30} />
                          <MdStar className={entry.stars >= 2 ? 'star-visible' : 'star-hidden'} size={30} />
                          <MdStar className={entry.stars >= 3 ? 'star-visible' : 'star-hidden'} size={30} />
                          <MdStar className={entry.stars >= 4 ? 'star-visible' : 'star-hidden'} size={30} />
                          <MdStar className={entry.stars >= 5 ? 'star-visible' : 'star-hidden'} size={30} />
                      </div>
                      <p className="reviewText">{entry.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      :
      <div className='discover-page-wrapper'>
        <div className='recipe-content-wrapper'>
          <h2>Recipe not found</h2>
          <p>You can try to refresh the page</p>
        </div>
      </div> }
    </>
  )
}

export default Recipe