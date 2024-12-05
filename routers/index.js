const router = require("express").Router()
const { UserController, AdminController } = require('../controllers/controller')

// Landing Page
router.get('/', UserController.loginForm)

// User /register
router.get('/register', UserController.registerForm)
router.post('/register', UserController.registerExecute)

// User get /login
router.get('/login', UserController.loginForm)
router.post('/login', UserController.loginExecute)

// User get /createProfile
router.get('/:userId/createProfile', UserController.createProfileForm)
router.post('/:userId/createProfile', UserController.createProfileExecute)

// User get /feeds
router.get('/:userId/feeds', UserController.feeds)

//User like and unlike post
router.get('/:userId/:postId/like', UserController.likePost)
router.get('/:userId/:postId/unlike', UserController.unlikePost)

//User add comment
router.post('/:userId/:postId/addComment', UserController.addComment)


// User get /findmatch
router.get('/:userId/findmatch', UserController.findMatch)

module.exports = router