require('dotenv').config()
const bcrypt = require('bcrypt')
const db = require('../database')
const jwt = require('jsonwebtoken')
const jwt_key = process.env.SECRET_KEY_USER
const jwt_decode = require('jwt-decode')

module.exports = {
    registerUser: (req, res, next) => {
        const nama = req.body.nama
        const email = req.body.email
        const password = req.body.password
        const phone = req.body.phone
        const createdAt = new Date()
        const latitude = req.body.latitude
        const longitude = req.body.longitude
        bcrypt.hash(password, 10)
        .then(function(hash) {
            const hashedPassword = hash
            db.query('INSERT INTO users(nama, email, password, noHP, createdAt, alamatLat, alamatLong) VALUES(?,?,?,?,?,?,?)', 
            [nama, email, hashedPassword, phone, createdAt, latitude, longitude])
            .then(() => {
                db.query('SELECT * FROM users WHERE email = ?', [email])
                .then(async ([results]) => {
                    const user = results[0]
                    const jwtData = {
                        'user_id': user.id,
                        'user_name': user.nama,
                        'user_email': user.email,
                        'user_phone': user.noHP,
                        'user_lat': user.alamatLat,
                        'user_long': user.alamatLong
                    }
                    const token = await jwt.sign(jwtData, jwt_key)
                    res.status(200)
                    res.json({
                        "status": true,
                        "message": "Success",
                        "token": token
                    })
                })
                .catch((err) => {
                    console.log(err)
                    next(err)
                })
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
    },

    loginUser: async (req, res, next) => {
        const email = req.body.email
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
        if (rows.length > 0) {
            const user = rows[0]
            const password = req.body.password
            bcrypt.compare(password, user.password)
            .then(async () => {
                const jwtData = {
                    'user_id': user.id,
                    'user_name': user.nama,
                    'user_email': user.email,
                    'user_phone': user.noHP,
                    'user_lat': user.alamatLat,
                    'user_long': user.alamatLong
                }
                const token = await jwt.sign(jwtData, jwt_key)
                if (token) {
                    res.status(200)
                    res.json({
                        "message": "Logged In!",
                        "token": token
                    })
                } else {
                    const err = new Error("Wrong Token!")
                    next(err)
                }
            })
            .catch((err) => {
                res.status(500)
                console.log(err)
                next(err)
            })
        } else {
            res.status(409)
            const err = new Error("No Email Detected, perhaps register first?")
            next(err)
        }
    },

    getUser: async (req, res, next) => {
        const [rows] = await db.query('SELECT * FROM users')
        try {
            res.status(200)
            res.json({
                "status": true,
                "message": "Success",
                "data": rows
            })
        } catch(err) {
            console.log(err)
            next(err)
        }
    },

    getUserById: async (req, res, next) => {
        const userId = req.params.id
        const userData = req.user
        if (userData.user_id == userId) {
            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId])
            try {
                res.status(200)
                res.json({
                    "status": true,
                    "message": "Success",
                    "data": rows[0],
                })
            } catch(err) {
                console.log(err)
                next(err)
            }
        } else {
            const [rows] = await db.query('SELECT nama, email FROM users WHERE id = ?', [userId])
            try {
                res.status(200)
                res.json({
                    "status": true,
                    "message": "Success",
                    "data": rows[0],
                })
            } catch(err) {
                console.log(err)
                next(err)
            }
        }        
    },

    deleteUser: (req, res, next) => {
        const userId = req.params.id
        db.query('DELETE FROM users WHERE id = ?', [userId])
        .then(() => {
            res.status(200)
            res.json({
                "status": true,
                "message": "Successfully Deleted",
            })
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
    },

    decodeJwt: async (req, res, next) => {
        const jwt = req.user
        const {user_id, user_name, user_email, user_phone, user_lat, user_long, iat} = jwt
        try {
            res.status(200)
            res.json({
                "success": true,
                "message": "Ini data2 usernya",
                "user_id": user_id,
                "user_name": user_name,
                "user_email": user_email,
                "user_phone": user_phone,
                "user_lat": user_lat,
                "user_long": user_long,
                "role": 'Penumpang'
            })
        } catch(err) {
            res.status(500)
            res.json({
                "success": false,
                "message": err
            })
            next(err)
        }
    },

    getHistory: async (req, res, next) => {
        const userid = req.user.user_id
        const [rows] = await db.query('SELECT * FROM history_user WHERE id_user = ?', userid)
        if (rows.length > 0) {
            res.status(200)
            res.json({
                "success": true,
                "message": "History",
                "data": rows
            })
        } else {
            res.status(200)
            res.json({
                "success": true,
                "message": "No History yet!"
            })
        }
    }
}