import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';

import connectMongoDB from './db/connectMongoDb.js';

dotenv.config(); // for read env file

// inisialisasi express
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // for read json req.body
app.use(express.urlencoded({ extended: true })); // for parse data url to object
app.use(cookieParser()); // for read cookie

// add middlewares for route auth
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// start the server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectMongoDB();
});
