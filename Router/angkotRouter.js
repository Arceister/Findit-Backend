const express = require('express')
const router = express.Router()

const {checkTokenNoAuth} = require('../Middleware')
const {checkToken} = require('../Middleware')
const angkotController = require('../Controller/angkotController')

router.get('/cekjarak/:id', checkToken, angkotController.getJarak)
router.get('/cekrute/:id', checkToken, angkotController.getRute)
router.get('/checkrumah/:id', checkToken, angkotController.checkRumah)
router.get('/cekharga/:id', checkToken, angkotController.getBiaya)
router.post('/places', checkToken, angkotController.placeSearch)
router.post('/naikangkot/:id', checkToken, angkotController.naikAngkot)
router.post('/test', checkToken, angkotController.showAngkots)

module.exports = router