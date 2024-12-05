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

module.exports = router