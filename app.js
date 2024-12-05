const express = require("express")
const app = express()
const port = 3000
const path = require('path')


app.set("view engine", 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))


const router = require('./routers/index')

app.use(router)


app.listen(port, () => {
      console.log(`Running on port ${port}`)
  })