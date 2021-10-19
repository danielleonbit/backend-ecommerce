const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const cors = require('cors');
const jwt = require('jsonwebtoken')

const app = express()

app.set('port', 5000 || process.env.PORT);

app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'));
app.use(cookieParser())

app.use("/api/users", require('./routes/users.routes'))
app.use("/api/categories", require('./routes/categories.routes'))
app.use("/api/products", require('./routes/products.routes'))
module.exports = app;
