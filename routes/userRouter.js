const express = require('express')
const auth = require('../middleware/userAuth')
const { fetchTask } = require('../controller/userController')


const router = express.Router()

router.get('/userTask',auth,  fetchTask)

module.exports = router