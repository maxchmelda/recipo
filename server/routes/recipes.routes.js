const router = require('express').Router();
const controller = require('../controllers/recipes.controllers');
const authenticate = require('../middleware/authenticate');

router.get('/all', authenticate, controller.getAllRecipes);
router.post('/create-recipe', authenticate, controller.createRecipe );
router.get('/get-recipe', authenticate, controller.getSingleRecipe );
router.post('/add-review', authenticate, controller.addReviewToRecipe );
router.get('/search', authenticate, controller.searchForRecipes )

module.exports = router;