const express = require('express')
const router = express.Router()

const {checkToken} = require('../Middleware')
const barangController = require('../Controller/barangController')

router.post('/', checkToken, barangController.kirimBarangBaru)

module.exports = router