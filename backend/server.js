const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const todoRoutes = require('./routes/todoRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://todo-summaryassistant.netlify.app',
    'https://todo-summary-assistant.netlify.app',
    'https://todo-summary-assistant-apii.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB with more robust options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4 // Use IPv4, skip trying IPv6
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  // Log more detailed error information
  if (err.name === 'MongoServerSelectionError') {
    console.error('MongoDB selection timeout - check network or credentials');
  }
});

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/summarize', summaryRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Todo Summary Assistant API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});