const { User, Profile, Post, Tag, Comment, PostTag, Like} = require('../models')
const { Op } = require('sequelize')
const { getDuration } = require('../helpers/calculateDuration')
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

    static async landingPage(req, res) {
        try {
            res.render('landingPage')
        } catch (error) {
            res.send(error)
        }
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
            console.log(user)
            req.session.userId = user.id
            req.session.admin = user.admin
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
            req.session.userId = userId
            req.session.admin = false
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
            var { tag, query } = {tag: "", query: ""}
            try{
                var { tag, query } = req.query
            } catch (error) {
            }
            const profile = await Profile.findOne({ where: { UserId: userId } })
            const posts = await Post.searchPosts(tag, query)
            const tags = await Tag.findAll()
            const likesData = await Like.getLikesData(userId)
            res.render('feeds', { posts, userId, tags, profile, likesData, getDuration})
        } catch (error) {
            console.log(error)
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

    static async addComment(req, res) {
        try {
            const { userId, postId } = req.params
            const { commentContent } = req.body
            await Comment.create({ PostId: postId, UserId: userId, commentContent })
            res.redirect(`/${userId}/feeds`)
        } catch (error) {
            res.send(error)
        }
    }

    static async findMatch(req, res) {
        try {
            const { userId } = req.params
            const profile = await Profile.findOne({ where: { UserId: userId } })
            const tags = await Tag.findAll()
            const profiles = await Profile.findMatch(userId)
            res.render('findMatch', { profiles, tags, profile, userId})
        } catch (error) {
            res.send(error)
        }
    }

    static async viewProfile(req, res) {
        try {
            const { userId, profileId } = req.params
            const profile = await Profile.findByPk(profileId)
            const tags = await Tag.findAll()
            const posts = await Post.searchPostsById(profileId)
            const likesData = await Like.getLikesData(profileId)
            // res.send(posts)
            res.render('viewProfile', { profile, posts, tags, userId, likesData })
        } catch (error) {
            res.send(error)
        }
    }

    static async editProfileForm(req, res) {
        try {
            const { userId, profileId } = req.params
            let errors = {"name": "SequelizeValidationError", "errors": {}, "instance": {}}
            try {
                errors = JSON.parse(req.query.errors, "utf-8")
            } catch (error) {
            }
            const profile = await Profile.findByPk(profileId)
            const tags = await Tag.findAll()
            res.render('editProfile', { profile, tags, errors, userId })
        } catch (error) {
            res.send(error)
        }
    }

    static async editProfileExecute(req, res) {
        try {
            const { userId, profileId } = req.params
            const { fullname, picture, location, dob, favorite1, favorite2, favorite3, motto } = req.body
            await Profile.update({ fullname, picture, location, dob, favorite1, favorite2, favorite3, motto }, { where: { id: profileId } })
            res.redirect(`/${userId}/profile/${profileId}`)
        } catch (error) {
            if (error.name === "SequelizeValidationError"){
                let formattedError = await Controller.formatSequelizeError(error)
                let { userId, profileId } = req.params
                res.redirect(`/${userId}/profile/${profileId}/edit?errors=${JSON.stringify(formattedError)}`)
                return
            }
            res.send(error)
        }
    }

    static async addPostForm(req, res) {
        try {
            const errors = {"name": "SequelizeValidationError", "errors": {}, "instance": {}}
            try {
                errors = JSON.parse(req.query.errors, "utf-8")
            } catch (error) {
            }
            const { userId } = req.params
            const profile = await Profile.findOne({ where: { UserId: userId } })
            const tags = await Tag.findAll()
            res.render('addPost', { profile, tags, userId, errors })
        } catch (error) {
            res.send(error)
        }
    }

    static async addPostExecute(req, res) {
        try {
            const { userId } = req.params
            const { content, imgUrl, tags } = req.body
            const newPost = await Post.create({ UserId: userId, content, imgUrl })
            await PostTag.bulkCreate(tags.map(tag => {
                return { PostId: newPost.id, TagId: tag }
            }))
            res.redirect(`/${userId}/feeds`)
        } catch (error) {
            if (error.name === "SequelizeValidationError"){
                let formattedError = await Controller.formatSequelizeError(error)
                let { userId } = req.params
                res.redirect(`/${userId}/addPost?errors=${JSON.stringify(formattedError)}`)
                return
            }
            res.send(error)
        }
    }

    static async deletePost(req, res) {
        try {
            const { userId, postId } = req.params
            await Post.destroy({ where: { id: postId } })
            res.redirect(`/${userId}/feeds`)
        } catch (error) {
            res.send(error)
        }
    }

    static async deleteComment(req, res) {
        try {
            const { userId, postId, commentId } = req.params
            await Comment.destroy({ where: { id: commentId } })
            res.redirect(`/${userId}/feeds`)
        } catch (error) {
            res.send(error)
        }
    }

    static async errorPage(req, res) {
        try {
            const { userId } = req.params
            const formattedError = JSON.parse(req.query.errors, "utf-8")
            const profile = await Profile.findOne({ where: { UserId: userId } })
            const tags = await Tag.findAll()
            res.render('error', {userId, profile, tags, formattedError})
        } catch (error) {
            res.send(error)
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy((error) => {
                if (error) {
                    res.send(error)
                } else {
                    res.redirect('/')
                }
            })
        } catch (error) {
            res.send(error)
        }
    }
}

class AdminController {
    static async adminPanel(req, res) {
        try {
            const { userId } = req.params
            const users = await User.findAll({ 
                include: {
                    model: Profile
                },
                attributes: { 
                    exclude: ['password'] 
                },
                order: [
                    ['id', 'ASC']
                ]
            })
            const profile = await Profile.findOne({ where: { UserId: userId } })
            const tags = await Tag.findAll()
            // res.send(users)
            res.render('adminPanel', { users, profile, tags, userId })
        } catch (error) {
            res.send(error)
        }
    }
    
    static async deleteUser(req, res) {
        try {
            const { userId, deleteId } = req.params
            await User.destroy({ where: { id: deleteId } })
            res.redirect(`/${userId}/adminPanel`)
        } catch (error) {
            res.send(error)
        }
    }

    static async giveAdmin(req, res) {
        try {
            const { userId, newAdminId } = req.params
            await User.update({ admin: true }, { where: { id: newAdminId } })
            res.redirect(`/${userId}/adminPanel`)
        } catch (error) {
            res.send(error)
        }
    }

    static async revokeAdmin(req, res) {
        try {
            const { userId, revokeAdminId } = req.params
            await User.update({ admin: false }, { where: { id: revokeAdminId } })
            res.redirect(`/${userId}/adminPanel`)
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = { UserController, AdminController, Controller }