const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./maBaseDeDonnees.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connecté à SQLite');

        db.run(`
            CREATE TABLE IF NOT EXISTS personnes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                adresse TEXT
            )
        `);

        // données initiales
        const personnes = [
            ['Bob', 'Tunis'],
            ['Alice', 'Ariana'],
            ['Charlie', 'Sfax']
        ];

        personnes.forEach(p => {
            db.run(`INSERT INTO personnes (nom, adresse) VALUES (?, ?)`, p);
        });
    }
});

module.exports = db;