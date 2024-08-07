const Recipe = require("../models/recipes.models");
const User = require("../models/users.models");


const getAllRecipes = async (req, res) => {

}

/*
    {
        image: image,
        ingredients: [
            { 
                ingredient: 'celery',
                amount: 10,
                unit: 'g'
            },
            { 
                ingredient: 'celery',
                amount: 10,
                unit: 'g'
            },
        ],
        tags: [ 'Chicken', 'Egg', 'Healthy' ],
        cookingTimes: { total: 3.5, prep: 2, cook: 5},
        description: "some text",
        steps: [
            {
                step: 1,
                instructions: "blablabla"
            }
        ],     
    }
*/

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
        // const user = req.user.userEmail;

        // const userInDb = await User.findOne({ 'email': user });
    
        // if (!userInDb) {
        //     return res.json({ ok: false, message: "User doesn't exist" });
        // }
    
        // const userName = userInDb.username;

        const userName = "maxch"
    
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