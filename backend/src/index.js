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

app.disable('x-powered-by');
app.set('trust proxy', 3);
app.use(cors({ origin: ['https://finflow-omega-five.vercel.app', 'http://localhost:5173'] }));
app.use(express.json());
app.use((req, res, next) => {
  if (req.body === null || typeof req.body !== 'object') req.body = {};
  next();
});

app.use('/auth', authRoutes);
app.use('/transactions', authMiddleware, transactionsRoutes);
app.use('/goals', authMiddleware, goalsRoutes);
app.use('/categories', authMiddleware, categoriesRoutes);

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'invalid JSON body' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'request body too large' });
  }
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: 'bad request' });
  }

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
