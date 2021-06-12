const express = require('express')
const router = express.Router()
const userRouter = require('./userRouter')
const angkotRouter = require('./angkotRouter')
const supirRouter = require('./supirRouter')
const barangRouter = require('./barangRouter')

//For Testing Purposes
router.get('/', (req, res) => {
    res.status(200)
    res.send('API Ready!')
})

router.use('/api/users', userRouter)
router.use('/api/supir', supirRouter)
router.use('/api/angkot', angkotRouter)
router.use('/api/barang', barangRouter)
router.use(notFound)
router.use(errorHandler)

function notFound(req, res, next) {
    res.status(404)
    const err = new Error("Page not found")
    next(err)
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500) 
    const message = err.message || "Internal server error"
    res.json({
        "message" : message
    })
}

module.exports = router