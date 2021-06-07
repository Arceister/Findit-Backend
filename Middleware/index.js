require('dotenv').config()
const jwt = require('jsonwebtoken');
const secret_key_user = process.env.SECRET_KEY_USER
const secret_key_sopir = process.env.SECRET_KEY_SOPIR

module.exports = {
    checkToken: (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, secret_key_user, (err, user) => {
            console.log(err)

            if (err) return res.sendStatus(403)

            req.user = user

            next()
        })
    },

    checkTokenNoAuth: (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
    
        if (token != null) {
            jwt.verify(token, secret_key_user, (err, user) => {
                console.log(err)
        
                if (err) return res.sendStatus(403)
        
                req.user = user
        
                next()
            })
        } else {
            req.user = 'Not Logged In!'
            next()
        }        
    },

    checkTokenSupir: (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, secret_key_sopir, (err, user) => {
            console.log(err)

            if (err) return res.sendStatus(403)

            req.user = user

            next()
        })
    },
}