const express = require('express')
const router = express.Router()

const {checkTokenNoAuth} = require('../Middleware')
const {checkToken} = require('../Middleware')
const angkotController = require('../Controller/angkotController')

router.get('/cekjarak/:id', checkToken, angkotController.getJarak)
router.get('/checkrumah/:id', checkToken, angkotController.checkRumah)

module.exports = router