import express from 'express';
import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/connectMongoDb.js';
// for read env file
import dotenv from 'dotenv';

dotenv.config();

// inisialisasi express
const app = express();
const PORT = process.env.PORT || 8000;

// add middleware auth
app.use('/api/auth', authRoutes);

// start the server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectMongoDB();
});
