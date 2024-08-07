const router = require('express').Router();
const controller = require('../controllers/recipes.controllers');
const authenticate = require('../middleware/authenticate');

router.get('/all', authenticate, controller.getAllRecipes);
router.post('/create-recipe', authenticate, controller.createRecipe );

module.exports = router;