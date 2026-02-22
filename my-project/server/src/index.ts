import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes       from './routes/auth.routes';
import adminRoutes      from './routes/admin.routes';
import userRoutes       from './routes/user.routes';
import orderRoutes      from './routes/orders';
import adminOrderRoutes from './routes/adminOrders';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded screenshots statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth',         authRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/user',         userRoutes);
app.use('/api/orders',       orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI!;
if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS:          45000,
  ssl: true,
  tls: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
