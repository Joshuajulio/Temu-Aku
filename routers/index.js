const router = require("express").Router()
const { UserController, AdminController, Controller } = require('../controllers/controller')

// Landing Page
router.get('/', Controller.landingPage)

// User /register
router.get('/register', UserController.registerForm)
router.post('/register', UserController.registerExecute)

// User get /createProfile
router.get('/:userId/createProfile', UserController.createProfileForm)
router.post('/:userId/createProfile', UserController.createProfileExecute)

// User get /login
router.get('/login', UserController.loginForm)
router.post('/login', UserController.loginExecute)

// Middleware
router.use(function (req, res, next) {
    if (!req.session.userId) {
        const error = new Error('Please login first!')
        let formattedError = {"errors": {"emailpassword": error.message}}
        res.redirect(`/login?errors=${JSON.stringify(formattedError)}`)
    } else {
        next()
    }
})



// User get /feeds
router.get('/:userId/feeds', UserController.feeds)

//User like and unlike post
router.get('/:userId/:postId/like', UserController.likePost)
router.get('/:userId/:postId/unlike', UserController.unlikePost)

//User add comment
router.post('/:userId/:postId/addComment', UserController.addComment)

// User get /findmatch
router.get('/:userId/findmatch', UserController.findMatch)

// User view profile
router.get('/:userId/profile/:profileId', UserController.viewProfile)

// User edit profile
router.get('/:userId/profile/:profileId/edit', UserController.editProfileForm)
router.post('/:userId/profile/:profileId/edit', UserController.editProfileExecute)

// User add post
router.get('/:userId/addPost', UserController.addPostForm)
router.post('/:userId/addPost', UserController.addPostExecute)

// User delete post
router.get('/:userId/:postId/delete', UserController.deletePost)

// User delete comment
router.get('/:userId/:commentId/deleteComment', UserController.deleteComment)

// User error page
router.get('/:userId/error', UserController.errorPage)

const isAdmin = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        const userId = req.session.userId
        const error = new Error('Authorization Error: You are not authorized to access this page!')
        let formattedError = {"errors": {"Authorization": error.message}}
        res.redirect(`/${userId}/error?errors=${JSON.stringify(formattedError)}`)
        res.render('error', {formattedError})
    }
}

// Access admin panel
router.get('/:userId/adminPanel', isAdmin, AdminController.adminPanel)

// Admin delete user
router.get('/:userId/:deleteId/deleteUser', isAdmin, AdminController.deleteUser)

// Admin give admin
router.get('/:userId/:newAdminId/giveAdmin', isAdmin, AdminController.giveAdmin)

// Admin revoke admin
router.get('/:userId/:revokeAdminId/revokeAdmin', isAdmin, AdminController.revokeAdmin)


// User logout
router.get('/:userId/logout', UserController.logout)

module.exports = router