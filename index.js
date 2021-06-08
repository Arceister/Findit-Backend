require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const port = process.env.APP_PORT
const router = require('./Router/index')

require('./database')
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/', router)

app.listen(port, () => {
    console.log("Hosted at", port)
})

// console.log(process.env.DB_HOST)
// console.log(process.env.DB_NAME)
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)