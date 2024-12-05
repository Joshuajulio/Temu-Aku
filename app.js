const express = require("express")
const app = express()
const port = 3000
const path = require('path')
const session = require('express-session')

const router = require('./routers/index')

app.set("view engine", 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: true }
}))


app.use(router)


app.listen(port, () => {
      console.log(`Running on port ${port}`)
  })