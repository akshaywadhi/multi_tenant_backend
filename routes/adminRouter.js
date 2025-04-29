const express = require('express');
const bcrypt = require('bcryptjs');
const zod = require('zod');
const prisma = require('../prisma.js');
const validate = require('../middleware/validate.js');
const adminLogin = require('../controller/adminLogin.js')
const {createOrg, org, fetchUser, deleteUser, fetchComment} = require('../controller/adminController.js')
const {signup, login} = require('../controller/userController.js');
const { authenticateToken, isAdmin } = require('../middleware/auth.js');


const router = express.Router();


const registerSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
  first_name: zod.string().optional(),
  last_name: zod.string().optional(),
  org_name: zod.string().min(1),
});

const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});


router.post(
  '/signup',
  validate(registerSchema),
 signup
);

router.post('/adminLogin', adminLogin)
router.post('/createOrg',authenticateToken, isAdmin,createOrg )
router.get('/orgs', org)
router.get('/fetchUsers', authenticateToken, isAdmin,fetchUser)
router.delete('/deleteUser/:id',authenticateToken, isAdmin, deleteUser)
router.get('/fetchComment', authenticateToken, isAdmin, fetchComment)


router.post(
  '/login',
  validate(loginSchema),
 login
);


module.exports = router;