const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    recipes: [String],
    image: { type: String }
},
{strictQuery: false}
)

module.exports = mongoose.model('users', userSchema);