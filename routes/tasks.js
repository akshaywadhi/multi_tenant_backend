const express = require('express');
const zod = require('zod');
const prisma = require('../prisma');
const { authenticate } = require('../middleware/auth');
const verifyTenant = require('../middleware/tenant');
const validate = require('../middleware/validate');

const router = express.Router();


const taskSchema = zod.object({
  title: zod.string().min(1),
  description: zod.string().optional(),
  status: zod.enum(['To Do', 'In Progress', 'Done']).optional(),
  assigned_to: zod.number().int().optional(),
  due_date: zod.string().datetime().optional(),
});

const commentSchema = zod.object({
  content: zod.string().min(1),
});


router.get(
  '/',
  authenticate,
  verifyTenant,
  async (req, res) => {
    const { org_id } = req.user;
    const { page = 1, limit = 10, status, assignee, due_date } = req.query;
    try {
      const skip = (page - 1) * limit;
      const where = { org_id };
      if (status) where.status = status;
      if (assignee) where.assigned_to = parseInt(assignee);
      if (due_date) where.due_date = { gte: new Date(due_date) };

      const tasks = await prisma.task.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: { assignee: true, creator: true },
      });

      const total = await prisma.task.count({ where });
      res.json({ tasks, total, page, limit });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post(
  '/',
  authenticate,
  verifyTenant,
  validate(taskSchema),
  async (req, res) => {
    const { org_id, user_id } = req.user;
    const { title, description, status, assigned_to, due_date } = req.body;
    try {
      const task = await prisma.task.create({
        data: {
          org_id,
          title,
          description,
          status: status || 'To Do',
          assigned_to,
          created_by: user_id,
          due_date: due_date ? new Date(due_date) : null,
        },
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);


router.put(
  '/:id',
  authenticate,
  verifyTenant,
  validate(taskSchema),
  async (req, res) => {
    const { org_id } = req.user;
    const { id } = req.params;
    const { title, description, status, assigned_to, due_date } = req.body;
    try {
      const task = await prisma.task.update({
        where: { id: parseInt(id), org_id },
        data: {
          title,
          description,
          status,
          assigned_to,
          due_date: due_date ? new Date(due_date) : null,
        },
      });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);


router.delete(
  '/:id',
  authenticate,
  verifyTenant,
  async (req, res) => {
    const { org_id } = req.user;
    const { id } = req.params;
    try {
      await prisma.task.delete({
        where: { id: parseInt(id), org_id },
      });
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);


router.post(
  '/:id/comments',
  authenticate,
  verifyTenant,
  validate(commentSchema),
  async (req, res) => {
    const { org_id, user_id } = req.user;
    const { id } = req.params;
    const { content } = req.body;
    try {
      const comment = await prisma.comment.create({
        data: {
          task_id: parseInt(id),
          user_id,
          content,
        },
      });
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;