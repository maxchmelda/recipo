import React, { useState } from 'react';

const tagsAvailible = [
  { name: 'Chicken', selected: false },
  { name: 'Eggs', selected: false },
  { name: 'Salad', selected: false },
  { name: 'Vegetarian', selected: false },
  { name: 'Healthy', selected: false },
  { name: 'Meat', selected: false },
  { name: 'Drink', selected: false },
  { name: 'Breakfast', selected: false },
  { name: 'Lunch', selected: false },
  { name: 'Dinner', selected: false }
];

const CreateRecipe = () => {
  const [imageFile, setImageFile] = useState();
  const [ingredients, setIngredients] = useState([{ ingredient: "", amount: "", unit: "" }]);
  const [steps, setSteps] = useState([{ step: 1, directions: "" }]);
  const [tags, setTags] = useState(tagsAvailible);
  const [cookingTimes, setCookingTimes] = useState({
    total: { hours: "", minutes: "" },
    prep: { hours: "", minutes: "" },
    cook: { hours: "", minutes: "" }
  });
  const [description, setDescription] = useState("");

  const handleImageChange = (e) => {
    setImageFile(URL.createObjectURL(e.target.files[0]));
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
    const newTags = tags.map(tag =>
      tag.name === tagToToggle.name
        ? { ...tag, selected: !tag.selected }
        : tag
    );
    setTags(newTags);
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

  const handleSubmit = () => {

    const recipe = {
      // "image": imageFile,
      "ingredients": ingredients,
      "tags": tags,
      "cookingTimes": cookingTimes,
      "description": description,
      "steps": steps
    }

    console.log(recipe);
    console.log('hi')
  }


  return (
    <>
      <div className='create-top-menu'>
        <h2>Create a Recipe</h2>
        <button type="button" onClick={() => handleSubmit()}>Submit</button>
      </div>

      <form className='create-wrapper' onSubmit={() => handleSubmit()}>
        <div className='create-image-upload'>
          {imageFile && <img src={imageFile} alt="Uploaded" />}
          <div className='create-image-actions'>
            <input type="file" onChange={handleImageChange} />
            <button type="button" onClick={(e) => setImageFile()}>Remove Image</button>
          </div>
        </div>

        <div className='create-ingredients'>
          <h3>Ingredients</h3>
          {ingredients.map((entry, index) => (
            <div className='create-ingredient-row' key={index}>
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
              <button type="button" onClick={() => handleRemoveIngredient(index)}>X</button>
            </div>
          ))}
          <button type="button" onClick={handleAddIngredient}>Add ingredient</button>
        </div>

        <div className='create-tags'>
          <h3>Tags</h3>
          {tags.map((tag, index) => (
            <button
              onClick={() => handleTagsToggle(tag)}
              key={index}
              type="button"
            >
              {tag.name}
            </button>
          ))}
        </div>

        <div className='create-cooking-times'>
          <h3>Cooking times</h3>
          <div className='create-cooking-times-box'>
            <p>Prep</p>
            <div>
              <div>
                <p>Hours</p>
                <input
                  type="number"
                  value={cookingTimes.prep.hours || ''}
                  onChange={(e) => handleTimesChange(e, 'prep', 'hours')}
                />
              </div>
              <div>
                <p>Minutes</p>
                <input
                  type="number"
                  value={cookingTimes.prep.minutes || ''}
                  onChange={(e) => handleTimesChange(e, 'prep', 'minutes')}
                />
              </div>
            </div>
          </div>
          <div className='create-cooking-times-box'>
            <p>Cook</p>
            <div>
              <div>
                <p>Hours</p>
                <input
                  type="number"
                  value={cookingTimes.cook.hours || ''}
                  onChange={(e) => handleTimesChange(e, 'cook', 'hours')}
                />
              </div>
              <div>
                <p>Minutes</p>
                <input
                  type="number"
                  value={cookingTimes.cook.minutes || ''}
                  onChange={(e) => handleTimesChange(e, 'cook', 'minutes')}
                />
              </div>
            </div>
          </div>
          <div className='create-cooking-times-box'>
            <p>Total</p>
            <div>
              <div>
                <p>Hours</p>
                <input
                  type="number"
                  value={cookingTimes.total.hours || ''}
                  onChange={(e) => handleTimesChange(e, 'total', 'hours')}
                />
              </div>
              <div>
                <p>Minutes</p>
                <input
                  type="number"
                  value={cookingTimes.total.minutes || ''}
                  onChange={(e) => handleTimesChange(e, 'total', 'minutes')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='create-description'>
          <h3>Description</h3>
          <textarea onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className='create-steps'>
          <h3>Instructions</h3>
          {steps.map((step, index) => {
            return (
              <div key={index}>
                <div>
                  <h4>{`Step ${step.step}`}</h4>
                  <button onClick={() => handleRemoveStep(index)}>X</button>
                </div>
                <textarea onChange={(e) => handleStepsChange(e, index)}/>
              </div>
            )
          })}
          <button type="button" onClick={() => handleAddStep()}>Add step</button>
        </div>

        <button type="button" onClick={() => handleSubmit()}>Submit</button>
      </form>
    </>
  );
};

export default CreateRecipe;
