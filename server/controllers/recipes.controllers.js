const Recipe = require("../models/recipes.models");
const User = require("../models/users.models");
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const saveBase64Image = (base64Str, fileName) => {
    return new Promise((resolve, reject) => {
        const base64Data = base64Str.replace(/^data:image\/png;base64,/, "");
        const filePath = path.join(__dirname, '..', 'uploads', fileName);
        fs.writeFile(filePath, base64Data, 'base64', (err) => {
            if (err) reject(err);
            resolve(filePath);
        });
    });
};

const createRecipe = async (req, res) => {
    const { ingredients, tags, cookingTimes, description, steps, image } = req.body;
    let imagePath = 'images/default_recipe_image.svg'; // Default image path

    try {
        if (image) {
            // Determine the file extension from the base64 string
            const matches = image.match(/^data:image\/(png|jpeg|jpg|gif);base64,/);
            const extension = matches ? matches[1] : 'png'; // Default to png if no match
            const fileName = `${Date.now()}.${extension}`;
            imagePath = await saveBase64Image(image, fileName);
        }

        let parsedSteps = typeof steps === 'string' ? JSON.parse(steps) : steps;
        let parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
        let parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        let parsedCookingTimes = typeof cookingTimes === 'string' ? JSON.parse(cookingTimes) : cookingTimes;

        if (!parsedIngredients) return res.json({ ok: false, message: "No ingredients provided" });
        if (!description) return res.json({ ok: false, message: "No description provided" });
        if (!parsedSteps) return res.json({ ok: false, message: "No steps provided" });

        const user = req.user.userEmail;
        const userInDb = await User.findOne({ 'email': user });

        if (!userInDb) return res.json({ ok: false, message: "User doesn't exist" });

        const userName = userInDb.username;

        const newRecipe = {
            'steps': parsedSteps,
            'ingredients': parsedIngredients,
            'tags': parsedTags,
            'author': userName,
            'times': parsedCookingTimes,
            'description': description,
            'image': imagePath
        };

        await Recipe.create(newRecipe);
        res.json({ ok: true, message: "Successfully created recipe" });
    } catch (error) {
        console.log(error);
        res.json({ ok: false, error });
    }
};


const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().exec();

        const recipesWithImages = recipes.map(recipe => {
            const imagePath = recipe.image ? path.join(__dirname, '..', 'uploads', path.basename(recipe.image)) : null;

            let imageBase64 = null;
            if (imagePath && fs.existsSync(imagePath)) {
                const imageBuffer = fs.readFileSync(imagePath);
                const extension = path.extname(imagePath).slice(1);
                imageBase64 = `data:image/${extension};base64,${imageBuffer.toString('base64')}`;
            }

            return {
                ...recipe.toObject(),
                image: imageBase64
            };
        });

        res.json({ ok: true, recipes: recipesWithImages });
    } catch (error) {
        console.log(error);
        res.json({ ok: false, error: 'Error fetching recipes' });
    }
};

module.exports = { getAllRecipes, createRecipe };
