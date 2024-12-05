const { User, Profile, Post, Tag, Comment, PostTag, Like} = require('../models')
const bcrypt = require('bcryptjs')

class Controller{
    static async formatSequelizeError(error){
        const formattedError = {
            name: error.name,
            errors: {}
          };
        
          error.errors.forEach(err => {
            if (!formattedError.errors[err.path]) {
              formattedError.errors[err.path] = err.message;
            }
          });
          formattedError.instance = error.errors[0].instance;
        
        return formattedError;
    }
}

class UserController {
    static async registerForm(req, res) {
        try {
            let errors = {"name": "SequelizeValidationError", "errors": {}, "instance": {}}
            try {
                errors = JSON.parse(req.query.errors, "utf-8")
            } catch (error) {
            }
            res.render('register', {errors})
        } catch (error) {
            res.send(error)
        }
    }

    static async registerExecute(req, res) {
        try {
            const { email, password } = req.body
            const newUser = await User.create({ email, password })
            res.redirect(`/${newUser.id}/createProfile`)
        } catch (error) {
            if (error.name === "SequelizeValidationError"){
                let formattedError = await Controller.formatSequelizeError(error)
                res.redirect(`/register?errors=${JSON.stringify(formattedError)}`)
                return
            }
            res.send(error)
        }
    }

    static async loginForm(req, res) {
        try {
            let errors = {"name": "SequelizeValidationError", "errors": {}, "instance": {}}
            try {
                errors = JSON.parse(req.query.errors, "utf-8")
            } catch (error) {
            }
            res.render('login', {errors})
        } catch (error) {
            res.send(error)
        }
    }

    static async loginExecute(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ where: { email } })
            if (!user) {
                throw new Error('Incorrect username or password.')
            }
            const isValidPassword = bcrypt.compareSync(password, user.password)
            if (!isValidPassword) {
                throw new Error('Incorrect username or password.')
            }
            res.redirect(`/${user.id}/feeds`)
        } catch (error) {
            if (error.name === "SequelizeValidationError"){
                let formattedError = await Controller.formatSequelizeError(error)
                res.redirect(`/login?errors=${JSON.stringify(formattedError)}`)
                return
            } else {
                let formattedError = {"errors": {"emailpassword": error.message}}
                res.redirect(`/login?errors=${JSON.stringify(formattedError)}`)
                return
            }
            res.send(error)
        }
    }

    static async createProfileForm(req, res) {
        try {
            let errors = {"name": "SequelizeValidationError", "errors": {}, "instance": {}}
            try {
                errors = JSON.parse(req.query.errors, "utf-8")
            } catch (error) {
            }
            const { userId } = req.params
            res.render('createProfile', {userId, errors})
        } catch (error) {
            res.send(error)
        }
    }

    static async createProfileExecute(req, res) {
        try {
            const { userId } = req.params
            const { fullname, picture, location, dob, favorite1, favorite2, favorite3, motto } = req.body
            await Profile.create({ UserId:userId, fullname, picture, location, dob, favorite1, favorite2, favorite3, motto })
            res.redirect(`/${userId}/feeds`)
        } catch (error) {
            if (error.name === "SequelizeValidationError"){
                let formattedError = await Controller.formatSequelizeError(error)
                let { userId } = req.params
                res.redirect(`/${userId}/createProfile?errors=${JSON.stringify(formattedError)}`)
                return
            }
            res.send(error)
        }
    }

    static async feeds(req, res) {
        try {
            const { userId } = req.params
            // Find all posts, comments, and likes
            const posts = await Post.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id'],
                        include: [
                            {
                                model: Profile,
                                attributes: ['fullname', 'picture'],
                            },
                        ]
                    },
                    {
                        model: Tag,
                        attributes: ['tagName'],
                    },
                    {
                        model: Comment,
                        attributes: ['commentContent'],
                        include: [
                            {
                                model: User,
                                    attributes: ['id'],
                                    include: [
                                        {
                                            model: Profile,
                                            attributes: ['fullname', 'picture'],
                                        },
                                ]
                            },
                        ]
                    },
                    {
                        model: Like,
                        attributes: ['UserId'],
                        include: [
                            {
                                model: User,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: Profile,
                                        attributes: ['fullname', 'picture'],
                                    },
                                ]
                            }
                        ]
                    },
                ],
            });
            // res.send(posts)
            res.render('feeds', { posts, userId })
        } catch (error) {
            res.send(error)
        }
    }

    static async likePost(req, res) {
        try {
            const { userId, postId } = req.params
            await Like.create({ PostId: postId, UserId: userId })
            res.redirect(`/${userId}/feeds`)
        } catch (error) {
            res.send(error)
        }
    }

    static async unlikePost(req, res) {
        try {
            const { userId, postId } = req.params
            await Like.destroy({ where: { PostId: postId, UserId: userId } })
            res.redirect(`/${userId}/feeds`)
        } catch (error) {
            res.send(error)
        }
    }
}

class AdminController {
}

module.exports = { UserController, AdminController, Controller }