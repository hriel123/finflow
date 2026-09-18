import { Router } from 'express';
import { prisma, findOwned } from '../lib/prisma.js';

const router = Router();

router.post('/', async (req, res) => {
  const { title, description, category, icon, targetAmount, currentAmount, deadline } = req.body;

  if (!title || !category || !icon || targetAmount === undefined || !deadline) {
    return res
      .status(400)
      .json({ error: 'title, category, icon, targetAmount and deadline are required' });
  }

  if (typeof targetAmount !== 'number' || !Number.isFinite(targetAmount) || targetAmount <= 0) {
    return res.status(400).json({ error: 'targetAmount must be a positive number' });
  }

  if (
    currentAmount !== undefined &&
    (typeof currentAmount !== 'number' || !Number.isFinite(currentAmount) || currentAmount < 0)
  ) {
    return res.status(400).json({ error: 'currentAmount must be a non-negative number' });
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
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'invalid goal id' });
  }

  const goal = await findOwned(prisma.goal, id, req.userId);

  if (!goal) {
    return res.status(404).json({ error: 'goal not found' });
  }

  res.json(goal);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'invalid goal id' });
  }

  const existing = await findOwned(prisma.goal, id, req.userId);

  if (!existing) {
    return res.status(404).json({ error: 'goal not found' });
  }

  const { title, description, category, icon, targetAmount, currentAmount, deadline } = req.body;

  if (
    targetAmount !== undefined &&
    (typeof targetAmount !== 'number' || !Number.isFinite(targetAmount) || targetAmount <= 0)
  ) {
    return res.status(400).json({ error: 'targetAmount must be a positive number' });
  }

  if (
    currentAmount !== undefined &&
    (typeof currentAmount !== 'number' || !Number.isFinite(currentAmount) || currentAmount < 0)
  ) {
    return res.status(400).json({ error: 'currentAmount must be a non-negative number' });
  }

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
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'invalid goal id' });
  }

  const existing = await findOwned(prisma.goal, id, req.userId);

  if (!existing) {
    return res.status(404).json({ error: 'goal not found' });
  }

  await prisma.goal.delete({ where: { id: existing.id } });

  res.status(204).send();
});

export default router;
