require('dotenv').config()
const bcrypt = require('bcrypt')
const db = require('../database')
const jwt = require('jsonwebtoken')
const jwt_key = process.env.SECRET_KEY_USER

module.exports = {
    kirimBarangBaru: async(req, res, next) => {

    }
}