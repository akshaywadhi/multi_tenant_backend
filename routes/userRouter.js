const express = require('express')
const authenticateUser = require('../middleware/userAuth')
const { fetchTask, comment } = require('../controller/userController')


const router = express.Router()

router.get('/userTask',authenticateUser,  fetchTask)
router.post('/comment', authenticateUser, comment)

module.exports = router