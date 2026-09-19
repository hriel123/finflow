import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Used in place of a real password hash when no user is found, so login takes
// the same time whether or not the email is registered (avoids leaking
// account existence via response timing).
const DUMMY_HASH = bcrypt.hashSync('finflow-timing-defense', 10);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'invalid email format' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const validPassword = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
  if (!user || !validPassword) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    return res.status(404).json({ error: 'user not found' });
  }

  res.json({ id: user.id, name: user.name, email: user.email });
});

router.put('/me', authMiddleware, async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'invalid email format' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== req.userId) {
    return res.status(409).json({ error: 'email already registered' });
  }

  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { name, email },
  });

  res.json({ id: user.id, name: user.name, email: user.email });
});

export default router;
