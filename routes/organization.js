const express = require('express');
const zod = require('zod');
const prisma = require('../prisma');
const { authenticate, authorize } = require('../middleware/auth');
const verifyTenant = require('../middleware/tenant');
const validate = require('../middleware/validate');

const router = express.Router();


const updateOrgSchema = zod.object({
  name: zod.string().min(1).optional(),
  subscription_status: zod.string().optional(),
});

const inviteSchema = zod.object({
  email: zod.string().email(),
  role: zod.enum(['Admin', 'Manager', 'User']),
});


router.get(
  '/profile',
  authenticate,
  verifyTenant,
  async (req, res) => {
    const { org_id } = req.user;
    try {
      const org = await prisma.organization.findUnique({ where: { id: org_id } });
      res.json(org);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);


router.put(
  '/profile',
  authenticate,
  verifyTenant,
  authorize(['Admin']),
  validate(updateOrgSchema),
  async (req, res) => {
    const { org_id } = req.user;
    const { name, subscription_status } = req.body;
    try {
      const org = await prisma.organization.update({
        where: { id: org_id },
        data: { name, subscription_status },
      });
      res.json(org);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);


router.get(
  '/users',
  authenticate,
  verifyTenant,
  authorize(['Admin']),
  async (req, res) => {
    const { org_id } = req.user;
    try {
      const users = await prisma.user.findMany({ where: { org_id } });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);


router.post(
  '/users/invite',
  authenticate,
  verifyTenant,
  authorize(['Admin']),
  validate(inviteSchema),
  async (req, res) => {
    const { org_id } = req.user;
    const { email, role } = req.body;
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

   
      const user = await prisma.user.create({
        data: {
          org_id,
          email,
          password_hash: 'invited', 
          role,
        },
      });

      res.json({ message: `Invited ${email} as ${role}` });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;