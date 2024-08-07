const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    steps: [
        { 
            step: { type: Number, required: true },
            instructions: { type: String, required: true }
        }
    ],
    ingredients: [
        { 
            ingredient: { type: String, required: true },
            amount: { type: Number, required: true },
            unit: { type: String, required: true }
        }
    ],
    tags: [ { type: String } ],
    author: { type: String, required: true },   
    times: {
        total: { type: Number },
        prep: { type: Number },
        cook: { type: Number }
    },
    reviews: [
        {
            user: {
                name: { type: String, required: true },
                id: { type: mongoose.Schema.Types.Mixed, required: true }
            },
            stars: { type: Number, min: 1, max: 5, required: true },
            text: { type: String, required: true },
            date: { type: Date, required: true }
        }
    ],
    description: { type: String, required: true },
    cooked_by: [
        { 
            id: { type: mongoose.Schema.Types.Mixed, required: true },
            times: { type: Number, required: true }
        }
    ],
    imagePath: { type: String }
}, { strictQuery: false });

module.exports = mongoose.model('Recipe', recipeSchema);
