import { Router } from 'express';
import { prisma, findOwned } from '../lib/prisma.js';

const router = Router();

function parseValidDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

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

  const parsedDeadline = parseValidDate(deadline);
  if (!parsedDeadline) {
    return res.status(400).json({ error: 'invalid deadline' });
  }

  const goal = await prisma.goal.create({
    data: {
      title,
      description,
      category,
      icon,
      targetAmount,
      currentAmount: currentAmount ?? 0,
      deadline: parsedDeadline,
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

  if (title !== undefined && !title) {
    return res.status(400).json({ error: 'title cannot be empty' });
  }

  if (category !== undefined && !category) {
    return res.status(400).json({ error: 'category cannot be empty' });
  }

  if (icon !== undefined && !icon) {
    return res.status(400).json({ error: 'icon cannot be empty' });
  }

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

  let parsedDeadline;
  if (deadline !== undefined) {
    parsedDeadline = parseValidDate(deadline);
    if (!parsedDeadline) {
      return res.status(400).json({ error: 'invalid deadline' });
    }
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
      ...(parsedDeadline !== undefined && { deadline: parsedDeadline }),
    },
  });

  res.json(goal);
});

// Atomic deposit/withdraw: the amount is computed from the database's
// current value inside this same request, not from client-held state, so
// two rapid clicks (or two tabs) can no longer overwrite each other based
// on a stale savedAmount read on the client.
router.post('/:id/deposit', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'invalid goal id' });
  }

  const { amount } = req.body;
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  const existing = await findOwned(prisma.goal, id, req.userId);
  if (!existing) {
    return res.status(404).json({ error: 'goal not found' });
  }

  const goal = await prisma.goal.update({
    where: { id: existing.id },
    data: { currentAmount: { increment: amount } },
  });

  res.json(goal);
});

router.post('/:id/withdraw', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'invalid goal id' });
  }

  const { amount } = req.body;
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  const existing = await findOwned(prisma.goal, id, req.userId);
  if (!existing) {
    return res.status(404).json({ error: 'goal not found' });
  }

  const newAmount = Math.max(0, Number(existing.currentAmount) - amount);
  const goal = await prisma.goal.update({
    where: { id: existing.id },
    data: { currentAmount: newAmount },
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
