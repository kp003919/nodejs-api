const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3001;

// ✅ Same database — same data!
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Password123!', // ✅ Matches your actual DB password
    database: 'MyFirstDb_v2', // Database name 
    waitForConnections: true,
    connectionLimit: 10
});

app.use(cors());
app.use(express.json());

// ✅ GET all + search
app.get('/api/Greetings', async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM GreetingItems';
        let params = [];

        if (search) {
            query += ' WHERE Name LIKE ? OR Message LIKE ?';
            params = [`%${search}%`, `%${search}%`];
        }
        query += ' ORDER BY CreatedAt DESC';

        const [rows] = await db.query(query, params);
        // ✅ Ensure consistent property names for React
        const normalized = rows.map(r => ({
            id: r.Id,
            name: r.Name,
            age: r.Age,
            address: r.Address,
            message: r.Message,
            createdAt: r.CreatedAt // ✅ Matches what React expects
        }));
        res.json(normalized);
    } catch (err) {
        console.error('GET error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET single by ID
app.get('/api/Greetings/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM GreetingItems WHERE Id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        const r = rows[0];
        res.json({
            id: r.Id,
            name: r.Name,
            age: r.Age,
            address: r.Address,
            message: r.Message,
            createdAt: r.CreatedAt
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ POST — create new
app.post('/api/Greetings', async (req, res) => {
    try {
        const { Name, Age, Address, Message } = req.body;
        const [result] = await db.query(
            'INSERT INTO GreetingItems (Name, Age, Address, Message, CreatedAt) VALUES (?, ?, ?, ?, NOW())',
            [Name, Age, Address, Message]
        );
        const [newRows] = await db.query('SELECT * FROM GreetingItems WHERE Id = ?', [result.insertId]);
        const r = newRows[0];
        res.status(201).json({
            id: r.Id,
            name: r.Name,
            age: r.Age,
            address: r.Address,
            message: r.Message,
            createdAt: r.CreatedAt
        });
    } catch (err) {
        console.error('POST error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ PUT — update
app.put('/api/Greetings/:id', async (req, res) => {
    try {
        const { Name, Age, Address, Message } = req.body;
        await db.query(
            'UPDATE GreetingItems SET Name=?, Age=?, Address=?, Message=? WHERE Id=?',
            [Name, Age, Address, Message, req.params.id]
        );
        const [updatedRows] = await db.query('SELECT * FROM GreetingItems WHERE Id = ?', [req.params.id]);
        const r = updatedRows[0];
        res.json({
            id: r.Id,
            name: r.Name,
            age: r.Age,
            address: r.Address,
            message: r.Message,
            createdAt: r.CreatedAt
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE
app.delete('/api/Greetings/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM GreetingItems WHERE Id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Node.js backend running`);
    console.log(`📍 URL: http://localhost:${PORT}/api/Greetings`);
    console.log(`🗄️  Database: MyFirstDb_v2`);
});