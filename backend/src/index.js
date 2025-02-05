require('dotenv').config();
const express = require('express');
const cors = require('cors');
const eventsRoutes = require('./routes/events');

const sequelize = require('./config/sequelize');
const Event = require('./models/event');
const Technician = require('./models/technician');

const models = { Event, Technician };
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventsRoutes);

// Start server
(async () => {
    try {
        // Test the database connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Synchronize models with the database
        await sequelize.sync({ force: true }); // Use { force: true } to reset tables
        console.log('Database synchronized successfully.');
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
