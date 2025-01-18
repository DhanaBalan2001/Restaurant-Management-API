import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from 'http';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import reservationRoutes from './routes/reservation.js';
import inventoryRoutes from './routes/inventory.js';
import reportRoutes from './routes/report.js';
import branchRoutes from './routes/branch.js';
import menuRoutes from './routes/menu.js';
import tableRoutes from './routes/table.js';
import orderRoutes from './routes/order.js';
import docsRouter from './routes/docs.js';
import { initializeSocket } from './services/socket.js';

const app = express();
dotenv.config();
app.use(express.json());

const server = createServer(app);
const io = initializeSocket(server);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/', docsRouter);


const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGODB);
      console.log("Connected to MongoDB!");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
};

// Connect to Database
connect();

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected!");
});

app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.send('Hello From Server Side!');
  });
  
  // Test route
  app.get('/test', (req, res) => {
    console.log('Test route accessed');
    res.send('This is a test route');
  });
  
  // Health check route
  app.get('/health', (req, res) => {
     res.status(200).send('OK');
  });

const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});