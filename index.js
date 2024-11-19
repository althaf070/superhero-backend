import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectToDb } from './db/connect.js';
import userRoutes from './routes/userRoutes.js'
import grievenceRoutes from './routes/grievenceRoute.js'
dotenv.config()


const app = express();
const PORT = process.env.PORT || 3000
const allowedOrgins=['http://localhost:5173','https://justicebridge.vercel.app','https://superhero-module.vercel.app']
app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrgins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));
app.use(express.json());    
app.use(cookieParser())

app.use('/api',userRoutes)
app.use('/api',grievenceRoutes)


app.listen(PORT,()=> {
    connectToDb()
    console.log("Server running on port 3000");
})
