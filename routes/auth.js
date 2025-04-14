const express = require('express');
const bcrypt = require('bcryptjs');
const zod = require('zod');
const prisma = require('../prisma');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const validate = require('../middleware/validate');

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
  '/register',
  validate(registerSchema),
  async (req, res) => {
    const { email, password, first_name, last_name, org_name } = req.body;
    console.log(req.body)
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const password_hash = await bcrypt.hash(password, 10);
      const organization = await prisma.organization.create({
        data: { name: org_name },
      });

      await prisma.user.create({
        data: {
          org_id: organization.id,
          email,
          password_hash,
          role: 'Admin',
          first_name,
          last_name,
        },
      });

      res.status(201).json({ message: 'User and organization created' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);


router.post(
  '/login',
  validate(loginSchema),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);


router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.user_id } });
    if (!user) return res.status(401).json({ error: 'Invalid refresh token' });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});


router.post('/logout', (req, res) => {
  
  res.json({ message: 'Logged out' });
});

module.exports = router;