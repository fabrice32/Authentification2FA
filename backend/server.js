// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // Ajoutez ceci pour servir des fichiers statiques
const app = express();
const port = 5000;

// Middleware pour parser le JSON
app.use(express.json());

// Initialiser la base de données SQLite
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, name TEXT)");
  db.run("INSERT INTO users (id, name) VALUES (1, 'John Doe')");
});

// Endpoint pour obtenir les utilisateurs
app.get('/api/users', (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(rows);
  });
});

// Route pour la racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur backend!');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
