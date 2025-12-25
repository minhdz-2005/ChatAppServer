import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { connectDB, disconnectDB } from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import relationshipRoutes from './routes/relationshipRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config(); // Load environment variables
const app = express(); // Initialize Express app

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

connectDB();
// Connect to database
// const db = await connectDB();

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


// REST Routes
app.use('/api/auth', authRoutes); // Auth routes
app.use("/api/profile", profileRoutes);
app.use("/api/relationship", relationshipRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);

// HTTP Server
const httpServer = http.createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Allow all origins for testing; restrict in production
        methods: ['GET', 'POST']
    }
});

app.set('io', io); // Make io accessible in routes/controllers via req.app.get('io')

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Client joining a conversation room
    socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Running the server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await disconnectDB();
    process.exit(0);
});