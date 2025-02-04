require('dotenv').config();
const express = require('express');
const cors = require('cors');
const eventsRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
