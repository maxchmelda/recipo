import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import DefaultImage from '../../assets/images/default_recipe_image.svg';
import './CreateRecipe.css';
import { API_URL } from '../../config';
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const tags = [
  'Chicken',
  'Egg',
  'Healthy',
  'Vegetarian',
  'Low carb',
  'High protein',
  'Gluten-free',
  'Dairy-free',
  'Quick',
  'Easy',
  'Keto',
  'Paleo',
  'Vegan',
  'Organic',
  'Low fat',
  'High fiber',
  'Nut-free',
  'Spicy',
  'Comfort food',
  'Meal prep',
  'Budget-friendly',
];


const CreateRecipe = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const [recipeName, setRecipeName] = useState("");
  const [imageFile, setImageFile] = useState();
  const [imageInputKey, setImageInputKey] = useState(Date.now());
  const [ingredients, setIngredients] = useState([{ ingredient: "", amount: "", unit: "" }]);
  const [steps, setSteps] = useState([{ step: 1, directions: "" }]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [cookingTimes, setCookingTimes] = useState({
    total: { hours: "", minutes: "" },
    prep: { hours: "", minutes: "" },
    cook: { hours: "", minutes: "" }
  });
  const [description, setDescription] = useState("");

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

  const handleRemoveImage = () => {
    setImageFile(DefaultImage);
    setImageInputKey(Date.now()); 
  };

  const handleIngredientsChange = (e, index, type) => {
    const newIngredients = [...ingredients];
    newIngredients[index][type] = e.target.value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    const newIngredients = [...ingredients, { ingredient: "", amount: "", unit: "" }];
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    if (newIngredients.length > 1) {
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const handleTagsToggle = (tagToToggle) => {
    const tagIndex = selectedTags.findIndex(item => item === tagToToggle);
  
    if (tagIndex === -1) {
      setSelectedTags([...selectedTags, tagToToggle]);
    } else {
      const newTags = [...selectedTags];
      newTags.splice(tagIndex, 1);
      setSelectedTags(newTags);
    }

    console.log(selectedTags)
  };
  

  const handleTimesChange = (e, type, unit) => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    const newTimes = { ...cookingTimes };

    if (type === 'total') {
      newTimes.total[unit] = value || '';
    } else {
      newTimes[type][unit] = value || '';
    }

    if (type !== 'total') {
      const prepHours = newTimes.prep.hours || 0;
      const prepMinutes = newTimes.prep.minutes || 0;
      const cookHours = newTimes.cook.hours || 0;
      const cookMinutes = newTimes.cook.minutes || 0;

      const prepTotalMinutes = (parseInt(prepHours, 10) * 60) + parseInt(prepMinutes, 10);
      const cookTotalMinutes = (parseInt(cookHours, 10) * 60) + parseInt(cookMinutes, 10);

      newTimes.total.hours = Math.floor((prepTotalMinutes + cookTotalMinutes) / 60) || '';
      newTimes.total.minutes = (prepTotalMinutes + cookTotalMinutes) % 60 || '';
    }

    setCookingTimes(newTimes);
  };

  const handleStepsChange = (e, index) => {
    const { value } = e.target;
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], directions: value };
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    const newStepNumber = steps.length + 1;
    const newSteps = [...steps, { step: newStepNumber, directions: "" }];
    setSteps(newSteps);
  };

  const handleRemoveStep = (index) => {
    const newSteps = [...steps];
    if (newSteps.length > 1) {
      newSteps.splice(index, 1);
      setSteps(newSteps);
    }
  };

  const handleSubmit = async () => {
    const recipe = {
      "recipeName": recipeName,
      "image": imageFile,
      "ingredients": ingredients,
      "tags": selectedTags,
      "cookingTimes": cookingTimes,
      "description": description,
      "steps": steps,
      "rating": 0,
    }

    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(`${API_URL}/recipes/create-recipe`, recipe);
      if (response.data.ok === true) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }


  return (
    <>
      <Navbar />

      <div className='create-page-wrapper'>
        <div className='create-top-menu'>
          <button className="create-decoy-button" type="button">Submit</button>
          <h2>Create a Recipe</h2>
          <button className="create-submit-button" type="button" onClick={() => handleSubmit()}>Submit</button>
        </div>

        <form className='create-wrapper' onSubmit={() => handleSubmit()}>
          <div className='create-recipe-name'>
            <h2 className='create-section-heading'>Recipe Name</h2>
            <input type="text" onChange={(e) => setRecipeName(e.target.value)}/>
          </div>

          <div className='create-image-upload'>
            <h2 className='create-section-heading'>Recipe Image</h2>
            <img src={imageFile ? imageFile : DefaultImage} alt="recipe-preview" className='create-image-image' />
            <div className='create-image-actions'>
              <button type="button" className="create-file-upload-button">
                <input
                  key={imageInputKey}
                  className="create-file-upload-input"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <span>Upload Image</span>
              </button>
              <button className="create-remove-image" type="button" onClick={handleRemoveImage}>
                Remove Image
              </button>
            </div>
        </div>

          <div className='create-ingredients'>
            <h2 className='create-ingredients-heading'>Ingredients</h2>
            {ingredients.map((entry, index) => (
              <div className='create-ingredients-entry' key={index}>
                <div className='create-ingredient-row-inputs'>
                  <input
                    placeholder="Name"
                    value={entry.ingredient}
                    onChange={(e) => handleIngredientsChange(e, index, "ingredient")}
                  />
                  <input
                    placeholder="Amount"
                    type="number"
                    value={entry.amount}
                    onChange={(e) => handleIngredientsChange(e, index, "amount")}
                  />
                  <input
                    placeholder="Unit"
                    value={entry.unit}
                    onChange={(e) => handleIngredientsChange(e, index, "unit")}
                  />
                </div>
                <button className='create-remove-ingredient' type="button" onClick={() => handleRemoveIngredient(index)}>
                    <IoClose className='create-remove-ingredient-button' size={30}/>
                </button>
              </div>
              
            ))}
            <button className="create-add-ingredient" type="button" onClick={handleAddIngredient}>Add ingredient</button>
          </div>

          <div className='create-tags'>
            <h2 className='create-tags-heading'>Tags</h2>
            <div className='create-tags-wrapper'>
              {tags.map((tag, index) => (
                <button
                  onClick={() => handleTagsToggle(tag)}
                  key={index}
                  type="button"
                  className={selectedTags.includes(tag) ? 'create-tag-selected' : 'create-tag'}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className='create-cooking-times'>
            <h2>Cooking times</h2>
            <div className='create-cooking-times-wrapper'>

              <div className='create-cooking-times-box'>
                <h3>Prep</h3>
                <div className='create-cooking-times-input'>
                    <input
                      placeholder='hours'
                      type="number"
                      value={cookingTimes.prep.hours || ''}
                      onChange={(e) => handleTimesChange(e, 'prep', 'hours')}
                    />
                    <input
                      placeholder='minutes'
                      type="number"
                      value={cookingTimes.prep.minutes || ''}
                      onChange={(e) => handleTimesChange(e, 'prep', 'minutes')}
                    />
                </div>
              </div>
              <div className='create-cooking-times-box'>
                <h3>Cook</h3>
                <div className='create-cooking-times-input'>
                    <input
                      placeholder='hours'
                      type="number"
                      value={cookingTimes.cook.hours || ''}
                      onChange={(e) => handleTimesChange(e, 'cook', 'hours')}
                    />
                    <input
                      placeholder='minutes'
                      type="number"
                      value={cookingTimes.cook.minutes || ''}
                      onChange={(e) => handleTimesChange(e, 'cook', 'minutes')}
                    />
                </div>
              </div>
              <div className='create-cooking-times-box'>
                <h3>Total</h3>
                <div className='create-cooking-times-input'>
                    <input
                      placeholder='hours'
                      type="number"
                      value={cookingTimes.total.hours || ''}
                      onChange={(e) => handleTimesChange(e, 'total', 'hours')}
                    />
                    <input
                      placeholder='minutes'
                      type="number"
                      value={cookingTimes.total.minutes || ''}
                      onChange={(e) => handleTimesChange(e, 'total', 'minutes')}
                      className=''
                    />
                </div>
              </div>
            </div>
            
          </div>

          <div className='create-description'>
            <h2>Description</h2>
            <textarea className="create-description-textarea" onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className='create-steps'>
            <h2>Instructions</h2>
            {steps.map((step, index) => {
              return (
                <div key={index} className="create-step-box">
                  <div className='create-steps-header'>
                    <h4>{`Step ${step.step}`}</h4>
                    <button className="create-remove-step" onClick={() => handleRemoveStep(index)}>
                      <IoClose className="create-remove-step-button" size={30}/>
                    </button>
                  </div>
                  <textarea className="create-steps-textarea" onChange={(e) => handleStepsChange(e, index)}/>
                </div>
              )
            })}
            <button className='create-add-step-button' type="button" onClick={() => handleAddStep()}>Add step</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateRecipe;
