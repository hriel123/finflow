import { Router } from 'express';
import { prisma, findOwned } from '../lib/prisma.js';
import { MAX_AMOUNT, isCents, parseId, textError } from '../lib/validate.js';

const router = Router();

function parseValidDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getUTCFullYear();
  return year >= 1900 && year <= 2100 ? date : null;
}

router.post('/', async (req, res) => {
  const { description, category, type, amount, date } = req.body;

  const invalidText = textError([description, category, type, date], 200);
  if (invalidText) {
    return res.status(400).json({ error: invalidText });
  }

  if (!description || !category || !type || amount === undefined || !date) {
    return res
      .status(400)
      .json({ error: 'description, category, type, amount and date are required' });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ error: 'type must be "income" or "expense"' });
  }

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  if (amount > MAX_AMOUNT) {
    return res.status(400).json({ error: 'amount too large' });
  }

  if (!isCents(amount)) {
    return res.status(400).json({ error: 'amounts must have at most 2 decimal places' });
  }

  const parsedDate = parseValidDate(date);
  if (!parsedDate) {
    return res.status(400).json({ error: 'invalid date' });
  }

  const transaction = await prisma.transaction.create({
    data: {
      description,
      category,
      type,
      amount,
      date: parsedDate,
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
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'invalid transaction id' });
  }

  const transaction = await findOwned(prisma.transaction, id, req.userId);

  if (!transaction) {
    return res.status(404).json({ error: 'transaction not found' });
  }

  res.json(transaction);
});

router.put('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'invalid transaction id' });
  }

  const existing = await findOwned(prisma.transaction, id, req.userId);

  if (!existing) {
    return res.status(404).json({ error: 'transaction not found' });
  }

  const { description, category, type, amount, date } = req.body;

  const invalidText = textError([description, category, type, date], 200);
  if (invalidText) {
    return res.status(400).json({ error: invalidText });
  }

  if (description !== undefined && !description) {
    return res.status(400).json({ error: 'description cannot be empty' });
  }

  if (category !== undefined && !category) {
    return res.status(400).json({ error: 'category cannot be empty' });
  }

  if (type !== undefined && type !== 'income' && type !== 'expense') {
    return res.status(400).json({ error: 'type must be "income" or "expense"' });
  }

  if (
    amount !== undefined &&
    (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0)
  ) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  if (amount > MAX_AMOUNT) {
    return res.status(400).json({ error: 'amount too large' });
  }

  if (amount !== undefined && !isCents(amount)) {
    return res.status(400).json({ error: 'amounts must have at most 2 decimal places' });
  }

  let parsedDate;
  if (date !== undefined) {
    parsedDate = parseValidDate(date);
    if (!parsedDate) {
      return res.status(400).json({ error: 'invalid date' });
    }
  }

  const transaction = await prisma.transaction.update({
    where: { id: existing.id },
    data: {
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(type !== undefined && { type }),
      ...(amount !== undefined && { amount }),
      ...(parsedDate !== undefined && { date: parsedDate }),
    },
  });

  res.json(transaction);
});

router.delete('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'invalid transaction id' });
  }

  const existing = await findOwned(prisma.transaction, id, req.userId);

  if (!existing) {
    return res.status(404).json({ error: 'transaction not found' });
  }

  await prisma.transaction.delete({ where: { id: existing.id } });

  res.status(204).send();
});

export default router;
