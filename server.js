const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3001;

// ✅ Database — matches your setup
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Password123!',        // ← Update with your MySQL password
    database: 'MyFirstDb_v2',
    waitForConnections: true,
    connectionLimit: 10
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// ✅ GET ALL + SEARCH
// ==========================================
app.get('/api/Greetings', async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM GreetingItems';
        let params = [];

        if (search) {
            query += ' WHERE Name LIKE ? OR Message LIKE ? OR Address LIKE ?';
            const term = `%${search}%`;
            params = [term, term, term];
        }

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        console.error('GET error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// ✅ GET SINGLE BY ID
// ==========================================
app.get('/api/Greetings/:id', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM GreetingItems WHERE Id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('GET single error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// ✅ POST — CREATE NEW (corrected for lowercase)
// ==========================================
app.post('/api/Greetings', async (req, res) => {
    try {
        // ✅ Matches React: lowercase name, age, address, message
        const { name, age, address, message } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name is required' });
        }

        const sql = `
            INSERT INTO GreetingItems (Name, Age, Address, Message, CreatedAt)
            VALUES (?, ?, ?, ?, NOW())
        `;

        const [result] = await db.execute(sql, [
            name.trim(),
            age || 0,
            address?.trim() || '',
            message?.trim() || ''
        ]);

        // ✅ Return same format as ASP.NET
        res.status(201).json({
            id: result.insertId,
            name: name.trim(),
            age: age || 0,
            address: address?.trim() || '',
            message: message?.trim() || '',
            createdAt: new Date()
        });
    } catch (err) {
        console.error('POST error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// ✅ PUT — UPDATE EXISTING
// ==========================================
app.put('/api/Greetings/:id', async (req, res) => {
    try {
        const { name, age, address, message } = req.body;
        const { id } = req.params;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name is required' });
        }

        const sql = `
            UPDATE GreetingItems
            SET Name = ?, Age = ?, Address = ?, Message = ?
            WHERE Id = ?
        `;

        const [result] = await db.execute(sql, [
            name.trim(),
            age || 0,
            address?.trim() || '',
            message?.trim() || '',
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({
            id: parseInt(id),
            name: name.trim(),
            age: age || 0,
            address: address?.trim() || '',
            message: message?.trim() || ''
        });
    } catch (err) {
        console.error('PUT error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// ✅ DELETE
// ==========================================
app.delete('/api/Greetings/:id', async (req, res) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM GreetingItems WHERE Id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({ message: 'Record deleted successfully' });
    } catch (err) {
        console.error('DELETE error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// ✅ START SERVER
// ==========================================
app.listen(PORT, async () => {
    console.log(`🚀 Node.js Backend running on port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}/api/Greetings`);
    console.log(`🗄️  Database: MyFirstDb_v2`);
    
    // Test DB connection on startup
    try {
        await db.getConnection();
        console.log('✅ Database connected successfully');
    } catch (err) {
        console.log('❌ Database connection failed — check password in server.js');
    }
});