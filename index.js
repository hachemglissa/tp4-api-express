const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./database');

const app = express();
const PORT = 3000;

// =======================
// MIDDLEWARES
// =======================

// Parser JSON
app.use(express.json());

// CORS (autoriser toutes les origines)
app.use(cors());

// Rate Limiting (100 requêtes / 15 min)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        message: "Trop de requêtes effectuées depuis cette IP, veuillez réessayer après 15 minutes."
    }
});

app.use(limiter);

// =======================
// ROUTES
// =======================

// Route test
app.get('/', (req, res) => {
    res.json("Registre de personnes !");
});

// GET all personnes
app.get('/personnes', (req, res) => {
    db.all("SELECT * FROM personnes", [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// GET personne by ID
app.get('/personnes/:id', (req, res) => {
    db.get(
        "SELECT * FROM personnes WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({
                message: "success",
                data: row
            });
        }
    );
});

// CREATE personne
app.post('/personnes', (req, res) => {
    const { nom, adresse } = req.body;

    db.run(
        `INSERT INTO personnes (nom, adresse) VALUES (?, ?)`,
        [nom, adresse],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({
                message: "success",
                data: { id: this.lastID }
            });
        }
    );
});

// UPDATE personne
app.put('/personnes/:id', (req, res) => {
    const { nom, adresse } = req.body;

    db.run(
        `UPDATE personnes SET nom = ?, adresse = ? WHERE id = ?`,
        [nom, adresse, req.params.id],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({
                message: "success"
            });
        }
    );
});

// DELETE personne
app.delete('/personnes/:id', (req, res) => {
    db.run(
        `DELETE FROM personnes WHERE id = ?`,
        [req.params.id],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({
                message: "success"
            });
        }
    );
});

// =======================
// START SERVER
// =======================

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});