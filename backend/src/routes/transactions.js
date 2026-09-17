import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.post('/', async (req, res) => {
  const { description, category, type, amount, date } = req.body;

  if (!description || !category || !type || amount === undefined || !date) {
    return res
      .status(400)
      .json({ error: 'description, category, type, amount and date are required' });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ error: 'type must be "income" or "expense"' });
  }

  const transaction = await prisma.transaction.create({
    data: {
      description,
      category,
      type,
      amount,
      date: new Date(date),
      userId: req.userId,
    },
  });

  res.status(201).json(transaction);
});

router.get('/', async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.userId },
    orderBy: { date: 'desc' },
  });

  res.json(transactions);
});

router.get('/:id', async (req, res) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!transaction || transaction.userId !== req.userId) {
    return res.status(404).json({ error: 'transaction not found' });
  }

  res.json(transaction);
});

router.put('/:id', async (req, res) => {
  const existing = await prisma.transaction.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'transaction not found' });
  }

  const { description, category, type, amount, date } = req.body;

  if (type !== undefined && type !== 'income' && type !== 'expense') {
    return res.status(400).json({ error: 'type must be "income" or "expense"' });
  }

  const transaction = await prisma.transaction.update({
    where: { id: existing.id },
    data: {
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(type !== undefined && { type }),
      ...(amount !== undefined && { amount }),
      ...(date !== undefined && { date: new Date(date) }),
    },
  });

  res.json(transaction);
});

router.delete('/:id', async (req, res) => {
  const existing = await prisma.transaction.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'transaction not found' });
  }

  await prisma.transaction.delete({ where: { id: existing.id } });

  res.status(204).send();
});

export default router;
