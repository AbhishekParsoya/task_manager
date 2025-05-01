import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes';
import connectDB from './config/db';


dotenv.config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('api/tasks', taskRoutes);
app.use('api/auth', authRoutes);

export default app;