import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, disconnectDB } from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import relationshipRoutes from './routes/relationshipRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config(); // Load environment variables
const app = express(); // Initialize Express app

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies


// Connect to database
const db = await connectDB();

// Test field
// import User from './models/User.js';
// const userTest = new User({
//     username: 'testuser',
//     passwordHash: 'hashedpassword123',
//     email: 'minh21@gmail.com',
//     avatar: '',
//     status: 'offline',
//     lastSeen: new Date(2025, 9, 19, 20, 0, 0),
//     friend: [],
// });
// await userTest.save();

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes); // Auth routes
app.use("/api/profile", profileRoutes);
app.use("/api/relationship", relationshipRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);

// Running the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await disconnectDB();
    process.exit(0);
});