const { User, Profile, Post, Tag, Comment, PostTag, PostComment, PostLikeUser} = require('../models')
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
            await User.create({ email, password })
            res.redirect('createProfile')
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
            // res.redirect('/feeds')
            res.send("masuk feeds")
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

}

class AdminController {
}

module.exports = { UserController, AdminController, Controller }