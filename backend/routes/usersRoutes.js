const express = require('express')
const router = express.Router()
const {login, register, data} = require('../controllers/usersControllers')
const {protect} = require ('../middleware/authMiddleware')

//endpoints publico
router.post('/login', login)
router.post('/register', register)

//endpointsprivado todavia sin proteccion
router.get('/data', protect, data)

module.exports = router
