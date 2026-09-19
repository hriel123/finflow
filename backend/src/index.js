import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { Prisma } from '@prisma/client';
import authRoutes from './routes/auth.js';
import transactionsRoutes from './routes/transactions.js';
import goalsRoutes from './routes/goals.js';
import categoriesRoutes from './routes/categories.js';
import { authMiddleware } from './middleware/auth.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is not set.');
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/transactions', authMiddleware, transactionsRoutes);
app.use('/goals', authMiddleware, goalsRoutes);
app.use('/categories', authMiddleware, categoriesRoutes);

app.use((err, req, res, next) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'resource already exists' });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'resource not found' });
    }
  }

  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
