import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.post('/', async (req, res) => {
  const { title, description, category, icon, targetAmount, currentAmount, deadline } = req.body;

  if (!title || !category || !icon || targetAmount === undefined || !deadline) {
    return res
      .status(400)
      .json({ error: 'title, category, icon, targetAmount and deadline are required' });
  }

  const goal = await prisma.goal.create({
    data: {
      title,
      description,
      category,
      icon,
      targetAmount,
      currentAmount: currentAmount ?? 0,
      deadline: new Date(deadline),
      userId: req.userId,
    },
  });

  res.status(201).json(goal);
});

router.get('/', async (req, res) => {
  const goals = await prisma.goal.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });

  res.json(goals);
});

router.get('/:id', async (req, res) => {
  const goal = await prisma.goal.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!goal || goal.userId !== req.userId) {
    return res.status(404).json({ error: 'goal not found' });
  }

  res.json(goal);
});

router.put('/:id', async (req, res) => {
  const existing = await prisma.goal.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'goal not found' });
  }

  const { title, description, category, icon, targetAmount, currentAmount, deadline } = req.body;

  const goal = await prisma.goal.update({
    where: { id: existing.id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(icon !== undefined && { icon }),
      ...(targetAmount !== undefined && { targetAmount }),
      ...(currentAmount !== undefined && { currentAmount }),
      ...(deadline !== undefined && { deadline: new Date(deadline) }),
    },
  });

  res.json(goal);
});

router.delete('/:id', async (req, res) => {
  const existing = await prisma.goal.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'goal not found' });
  }

  await prisma.goal.delete({ where: { id: existing.id } });

  res.status(204).send();
});

export default router;
