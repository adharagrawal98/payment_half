require('dotenv').config()
const express = require('express')
const paypal = require('./services/paypal')

const app = express()



app.get('/', (req, res) => {
    res.render('index')
})


app.listen(5000, () => console.log('Server started on port 5000'))