const Recipe = require('../models/recipes.models');
const User = require('../models/users.models');

// Controller function to create a recipe
const createRecipe = async (req, res) => {
    const { recipeName, ingredients, tags, cookingTimes, description, steps, image, rating } = req.body;

    try {
        const user = req.user.userEmail;
        const userInDb = await User.findOne({ 'email': user });

        if (!userInDb) return res.json({ ok: false, message: "User doesn't exist" });

        const userName = userInDb.username;

        if (!ingredients || ingredients.length === 0) {
            return res.json({ ok: false, message: "Invalid ingredients" });
        }

        if (!description) return res.json({ ok: false, message: "No description provided" });

        if (!steps) return res.json({ ok: false, message: "No steps provided" });

        if (!recipeName) return res.json({ ok: false, message: "No recipe name provided" });

        //default image implementation
        const imageField = image ? image : null;

        const newRecipe = {
            'name': recipeName,
            'steps': steps,
            'ingredients': ingredients,
            'tags': tags,
            'author': userName,
            'times': cookingTimes,
            'description': description,
            'image': imageField,
            'rating': rating,
        };

        await Recipe.create(newRecipe);
        res.json({ ok: true, message: "Successfully created recipe" });
    } catch (error) {
        console.error("Error creating recipe:", error);
        res.json({ ok: false, error });
    }
};

// Controller function to get all recipes
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().exec();

        res.json({ ok: true, recipes: recipes });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.json({ ok: false, error: 'Error fetching recipes' });
    }
};

const getSingleRecipe = async (req, res) => {
    const { recipeId } = req.query;
  
    console.log(recipeId);
  
    if (!recipeId) {
      return res.status(400).json({ ok: false, message: 'Recipe ID is required' });
    }
  
    try {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ ok: false, message: 'Recipe not found' });
      }
      res.json({ ok: true, recipe: recipe });
    } catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
};  


const addReviewToRecipe = async (req, res) => {
    const userEmail = req.user.userEmail;
    const { recipeId, review, stars } = req.body;

    if (!userEmail) return res.status(404).json({ ok: false, message: 'User not found' });
    if (!recipeId) return res.status(404).json({ ok: false, message: 'No recipe ID provided' });
    if (!review) return res.status(400).json({ ok: false, message: 'Review cannot be blank' });
    if (stars < 1 || stars > 5) return res.status(400).json({ ok: false, message: 'Stars must be between 1 and 5' });

    try {
        const recipe = await Recipe.findById(recipeId);
        const user = await User.findOne({ email: userEmail });

        if (!recipe) return res.status(404).json({ ok: false, message: 'Recipe not found' });
        if (!user) return res.status(404).json({ ok: false, message: 'User not found' });

        const userName = user.username;

        const reviewToAdd = {
            userName,
            text: review,
            stars: stars,
        };

        const existingReviewIndex = recipe.reviews.findIndex(r => r.userName === userName);

        if (existingReviewIndex !== -1) {
            recipe.reviews[existingReviewIndex] = reviewToAdd;
        } else {
            recipe.reviews.push(reviewToAdd);
        }

        const totalStars = recipe.reviews.reduce((sum, review) => sum + review.stars, 0);
        const averageRating = totalStars / recipe.reviews.length;

        const roundedRating = Math.round(Math.max(1, Math.min(5, averageRating)));

        recipe.rating = roundedRating;

        await recipe.save();

        res.status(200).json({ ok: true, message: 'Review added/updated successfully' });
    } catch (error) {
        console.error('Error adding/updating review:', error);
        res.status(500).json({ ok: false, message: 'Server error' });
    }
};

const searchForRecipes = async (req, res) => {
    const { searchString } = req.query;

    if (!searchString) {
        return res.status(400).json({ ok: false, message: 'Search string is required' });
    }

    try {
        const recipes = await Recipe.find({
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { description: { $regex: searchString, $options: 'i' } },
                { tags: { $regex: searchString, $options: 'i' } }
            ]
        });

        res.status(200).json({ ok: true, recipes });
    } catch (error) {
        console.error('Error searching for recipes:', error);
        res.status(500).json({ ok: false, message: 'Server error' });
    }
};


const toggleRecipeInCB = async (req, res) => {
    const { recipeId } = req.body;
    const userEmail = req.user.userEmail;

    try {
        const user = await User.findOne({ email: userEmail });

        let bookmarked = user.recipes;
        const recipeIndex = bookmarked.findIndex(id => id.toString() === recipeId.toString());

        if (recipeIndex !== -1) {
            bookmarked.splice(recipeIndex, 1);
        } else {
            bookmarked.push(recipeId);
        }

        user.recipes = bookmarked;

        await user.save();

        res.status(200).json({ ok: true, message: 'Toggled recipe in user\'s bookmark successfully' });
    } catch (error) {
        console.error('Error toggling recipe in cookbook:', error);
        res.status(500).json({ ok: false, message: 'Server error' });
    }
}


const getBookmarked = async (req, res) => {
    const userEmail = req.user.userEmail;

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ ok: false, message: 'User not found' });
        }
        
        const bookmarkedRecipes = await Recipe.find({ _id: { $in: user.recipes } });

        res.status(200).json({ ok: true, data: bookmarkedRecipes });
    } catch (error) {
        console.error('Error fetching bookmarked recipes:', error);
        res.status(500).json({ ok: false, message: 'Server error' });
    }
};






module.exports = { getAllRecipes, createRecipe, getSingleRecipe, addReviewToRecipe, searchForRecipes, toggleRecipeInCB, getBookmarked };
