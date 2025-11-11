import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routes/user.route.js';
import PrivateRouter from './routes/private.routes.js';
import cors from 'cors';
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('ChatPro Backend is running!');
})
app.use(cors({
  origin: "http://localhost:5173",  // your frontend URL
  credentials: true
}));
app.use('/api/users', router)
app.use('/api/private', PrivateRouter);
app.listen(5000, () => {
    connectDB();
    console.log('Server is running on http://localhost:5000');
});