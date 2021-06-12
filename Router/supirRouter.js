const express = require('express')
const supirController = require('../Controller/supirController')
const router = express.Router()
const {checkTokenSupir} = require('../Middleware')

router.get('/', supirController.getSupir)
router.get('/jwt', checkTokenSupir, supirController.decodeJwt)
router.get('/history', checkTokenSupir, supirController.getHistory)
router.get('/:id', checkTokenSupir, supirController.getSupirById)
router.post('/', supirController.registerSupir)
router.post('/signin', supirController.loginSupir)
router.delete('/', checkTokenSupir, supirController.deleteSupir)

module.exports = router