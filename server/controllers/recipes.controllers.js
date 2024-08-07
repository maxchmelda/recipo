const Recipe = require("../models/recipes.models");
const User = require("../models/users.models");


const getAllRecipes = async (req, res) => {

}


const createRecipe = async (req, res) => {
    const { image, ingredients, tags, cookingTimes, description, steps } = req.body;

    if (!image) {
        const imagePath = 'someDefaultImage'
    }

    if (!ingredients) {
        return res.json({ ok: false, message: "No ingredients provided" });
    }

    if (!description) {
        return res.json({ ok: false, message: "No description provided" });
    }

    if (!steps) {
        return res.json({ ok: false, message: "No steps provided" });
    }

    try {
        const user = req.user.userEmail;

        const userInDb = await User.findOne({ 'email': user });
    
        if (!userInDb) {
            return res.json({ ok: false, message: "User doesn't exist" });
        }
    
        const userName = userInDb.username;
    
        //upload Image from request to server and get imagePath
    
        const newRecipe = {
            'steps': steps,
            'ingredients': ingredients,
            'tags': tags,
            'author': userName,
            'times': cookingTimes,
            'description': description,
            // 'imagePath': imagePath,
        }
    
        await Recipe.create(newRecipe);
        res.json({ ok: true, message: "Successfully created recipe" });
    } catch (error) {
        console.log(error)
        res.json({ ok: false, error });
    }
}




module.exports = { getAllRecipes, createRecipe };