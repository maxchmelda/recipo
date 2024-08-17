const router = require('express').Router();
const controller = require('../controllers/users.controllers');
const authenticate = require('../middleware/authenticate');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/verify_token', controller.verify_token);
router.post('/edit_user', authenticate, controller.editUser)
router.get('/get_user_pfp', authenticate, controller.getUserPicture);
router.get('/bookmarked', authenticate, controller.getBookmarkedRecipes)
router.get('/user', authenticate, controller.getUser)


module.exports = router;