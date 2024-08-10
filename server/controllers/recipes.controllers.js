const Recipe = require('../models/recipes.models');
const User = require('../models/users.models');

// Controller function to create a recipe
const createRecipe = async (req, res) => {
    const { recipeName, ingredients, tags, cookingTimes, description, steps, image } = req.body;

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
            'image': imageField
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

module.exports = { getAllRecipes, createRecipe };
