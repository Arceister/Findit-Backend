require('dotenv').config
const mysql = require('mysql2/promise')

const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'findit',
    user: process.env.DB_USER || 'root',
    connectTimeout: 10000,
    connectionLimit: 1000,
})

db.query('SELECT 1=1 AS RESULT')
.then(() => {
    console.log("Connected!")
})
.catch((err) => {
    console.log(err)
})

module.exports = db