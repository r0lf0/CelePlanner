const express = require('express');
const router = express.Router();

// Sample events data
let events = [];

// Get all events
router.get('/', (req, res) => {
  res.json(events);
});

// Add a new event
router.post('/', (req, res) => {
  const newEvent = req.body;
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Delete an event by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  events = events.filter(event => event.id !== id);
  res.status(204).send();
});

module.exports = router;
