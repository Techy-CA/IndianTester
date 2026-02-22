import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes  from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes  from './routes/user.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user',  userRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
