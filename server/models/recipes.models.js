const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    steps: [
        { 
            step: { type: Number, required: true },
            directions: { type: String, required: true }
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
        total: { 
            hours: { type: Number },
            minutes: { type: Number }
         },
        prep: { 
            hours: { type: Number },
            minutes: { type: Number }
         },
        cook: { 
            hours: { type: Number },
            minutes: { type: Number }
         },
    },
    reviews: [
        {
            userName: { type: String, required: true },
            stars: { type: Number, min: 1, max: 5, required: true },
            text: { type: String, required: true },
        }
    ],
    rating: { type: Number, min: 1, max: 5, required: true },
    description: { type: String, required: true },
    cooked_by: [
        { 
            id: { type: mongoose.Schema.Types.Mixed, required: true },
            times: { type: Number, required: true }
        }
    ],
    image: { type: String, required: true }
}, { strictQuery: false });

module.exports = mongoose.model('Recipe', recipeSchema);
