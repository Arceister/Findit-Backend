require('dotenv').config()
const bcrypt = require('bcrypt')
const db = require('../database')
const jwt = require('jsonwebtoken')
const jwt_key = process.env.SECRET_KEY_SOPIR

module.exports = {
    registerSupir: (req, res, next) => {
        const nama = req.body.nama
        const email = req.body.email
        const password = req.body.password
        const phone = req.body.phone
        const idAngkot = req.body.idAngkot
        bcrypt.hash(password, 10)
        .then(function(hash) {
            const hashedPassword = hash
            db.query('INSERT INTO supir(nama, email, password, noHP, saldo, id_angkot) VALUES(?,?,?,?,?,?)', 
            [nama, email, hashedPassword, phone, 0, idAngkot])
            .then(() => {
                db.query('SELECT * FROM supir WHERE email = ?', [email])
                .then(async ([results]) => {
                    const supir = results[0]
                    const jwtData = {
                        'supir_id': supir.id,
                        'supir_name': supir.nama,
                        'supir_email': supir.email,
                        'supir_phone': supir.noHP,
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

    loginSupir: async (req, res, next) => {
        const email = req.body.email
        const [rows] = await db.query('SELECT * FROM supir WHERE email = ?', [email])
        if (rows.length > 0) {
            const supir = rows[0]
            const password = req.body.password
            bcrypt.compare(password, supir.password)
            .then(async () => {
                const jwtData = {
                    'supir_id': supir.id,
                    'supir_name': supir.nama,
                    'supir_email': supir.email,
                    'supir_phone': supir.noHP,
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

    getSupir: async (req, res, next) => {
        const [rows] = await db.query('SELECT * FROM supir')
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

    getSupirById: async (req, res, next) => {
        const supirId = req.params.id
        const supirData = req.user
        if (supirData.supir_id == supirId) {
            const [rows] = await db.query('SELECT * FROM supir WHERE id = ?', [supirId])
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
            const [rows] = await db.query('SELECT nama, email FROM supir WHERE id = ?', [supirId])
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

    deleteSupir: (req, res, next) => {
        const supirId = req.params.id
        const supirAuth = req.user.supir_id
        if (supirAuth == supirId) {
            db.query('DELETE FROM supir WHERE id = ?', [supirId])
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
        } else {
            res.status(401)
            res.json({
                "status": false,
                "message": "You're not that"
            })
        }
    },

    decodeJwt: async (req, res, next) => {
        const jwt = req.user
        const {supir_id, supir_name, supir_email, supir_phone, iat} = jwt
        try {
            res.status(200)
            res.json({
                "success": true,
                "message": "Ini data2 supirnya",
                "supir_id": supir_id,
                "supir_name": supir_name,
                "supir_email": supir_email,
                "supir_phone": supir_phone,
                "role": 'Supir'
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
        const userid = req.user.supir_id
        const [rows] = await db.query('SELECT * FROM history_supir WHERE id_supir = ?', userid)
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