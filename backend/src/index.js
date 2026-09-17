import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import transactionsRoutes from './routes/transactions.js';
import goalsRoutes from './routes/goals.js';
import categoriesRoutes from './routes/categories.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/transactions', authMiddleware, transactionsRoutes);
app.use('/goals', authMiddleware, goalsRoutes);
app.use('/categories', authMiddleware, categoriesRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
