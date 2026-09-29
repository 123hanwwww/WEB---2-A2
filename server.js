// api/server.js
// Express server exposing the Charity Events REST API.
// All endpoints are read-only (GET), per Assessment 2 requirements.
const express = require('express');
const db = require('./event_db');

const app = express();
const PORT = 3000;

// CORS - allow the client site (served from any origin) to call this API.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ---------------------------------------------------------------------------
// 1. GET /api/events
// Home page data: active + upcoming/current events only.
// ---------------------------------------------------------------------------
app.get('/api/events', (req, res) => {
  try {
    const sql = `
      SELECT e.event_id, e.event_name, e.event_date, e.location, e.image_url,
             c.category_name, e.ticket_price, e.goal_amount, e.raised_amount
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.status = 'active'
        AND e.event_date >= NOW()
      ORDER BY e.event_date ASC
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 2. GET /api/events/search
// Search/filter by any combination of date, location and category_id.
// NOTE: must be registered before /api/events/:id so "search" is not
//       treated as an id.
// ---------------------------------------------------------------------------
app.get('/api/events/search', (req, res) => {
  try {
    const { date, location, category_id } = req.query;

    let sql = `
      SELECT e.event_id, e.event_name, e.event_date, e.location, e.image_url,
             c.category_name, e.ticket_price, e.goal_amount, e.raised_amount
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.status = 'active'
    `;
    const params = [];

    if (date) {
      sql += ' AND DATE(e.event_date) = ?';
      params.push(date);
    }
    if (location) {
      sql += ' AND e.location LIKE ?';
      params.push(`%${location}%`);
    }
    if (category_id) {
      sql += ' AND e.category_id = ?';
      params.push(category_id);
    }

    sql += ' ORDER BY e.event_date ASC';

    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 3. GET /api/categories
// All categories for the search page <select>.
// ---------------------------------------------------------------------------
app.get('/api/categories', (req, res) => {
  try {
    const sql = 'SELECT category_id, category_name FROM categories ORDER BY category_name ASC';
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 4. GET /api/events/:id
// Full details for a single event (joins organisations and categories).
// ---------------------------------------------------------------------------
app.get('/api/events/:id', (req, res) => {
  try {
    const id = req.params.id;
    const sql = `
      SELECT e.*, c.category_name, o.org_name, o.mission, o.contact_email,
             o.contact_phone, o.website
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      JOIN organisations o ON e.org_id = o.org_id
      WHERE e.event_id = ?
    `;
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(results[0]);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Charity Events API running on http://localhost:${PORT}`);
});
