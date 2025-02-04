const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all events
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new event
router.post('/', async (req, res) => {
    const { title, show_time } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO events (title, show_time) VALUES ($1, $2) RETURNING *',
            [title, show_time]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete an event by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Get the event ID from the request parameters
    try {
        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Event not found' }); // Respond if no event was found
        }
        res.status(200).json(result.rows[0]); // Respond with the deleted event
    } catch (err) {
        console.error(err); // Log any errors
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
