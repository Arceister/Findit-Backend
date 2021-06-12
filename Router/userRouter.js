const express = require('express')
const router = express.Router()

const {checkTokenNoAuth} = require('../Middleware')
const {checkToken} = require('../Middleware')
const userController = require('../Controller/userController')

router.get('/',userController.getUser)
router.get('/jwt', checkToken, userController.decodeJwt)
router.get('/history', checkToken, userController.getHistory)
router.get('/:id', checkTokenNoAuth, userController.getUserById)
router.post('/', userController.registerUser)
router.post('/signin', userController.loginUser)
router.delete('/:id', userController.deleteUser)

module.exports = router