import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.post('/', async (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'name and type are required' });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ error: 'type must be "income" or "expense"' });
  }

  const existing = await prisma.category.findFirst({
    where: { userId: req.userId, name, type },
  });
  if (existing) {
    return res.status(409).json({ error: 'category already exists' });
  }

  const category = await prisma.category.create({
    data: { name, type, userId: req.userId },
  });

  res.status(201).json(category);
});

router.get('/', async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'asc' },
  });

  res.json(categories);
});

router.delete('/:id', async (req, res) => {
  const existing = await prisma.category.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'category not found' });
  }

  await prisma.category.delete({ where: { id: existing.id } });

  res.status(204).send();
});

export default router;
