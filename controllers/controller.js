const { User, Profile, Post, Tag, Comment, PostTag, PostComment, PostLikeUser} = require('../models')

class Controller{
    static async formatError(error){
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
            res.send({ email, password })
        } catch (error) {
            if (error.name === "SequelizeValidationError"){
                const formattedError = await Controller.formatError(error)
                res.redirect(`/register?errors=${JSON.stringify(formattedError)}`)
                return
            }
            res.send(error)
        }
    }

    static async loginForm(req, res) {
        try {
            res.render('login')
        } catch (error) {
            res.send(error)
        }
    }

    static async loginExecute(req, res) {
        try {
            res.send('login submit')
        } catch (error) {
            res.send(error)
        }
    }

}

class AdminController {
}

module.exports = { UserController, AdminController, Controller }