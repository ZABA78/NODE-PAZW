const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2'); // Importuj mysql2

const app = express();
const port = 3000;

// Middleware do parsowania danych z formularza
app.use(bodyParser.urlencoded({ extended: true }));

// Połączenie z bazą danych MySQL
const db = mysql.createConnection({
    host: 'localhost',      // Adres hosta
    user: 'root',           // Nazwa użytkownika MySQL
    password: '',           // Hasło użytkownika MySQL
    database: 'moja_baza'   // Nazwa bazy danych
});

// Sprawdzenie połączenia z bazą danych
db.connect((err) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err);
        return;
    }
    console.log('Połączono z bazą danych MySQL');
});

// Serwowanie pliku HTML przy żądaniu GET /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Obsługa formularza i zapis danych do bazy MySQL
app.post('/submit', (req, res) => {
    const { fname, lname } = req.body;

    // Zapis danych do bazy MySQL
    const sql = 'INSERT INTO users (first_name, last_name) VALUES (?, ?)';
    db.query(sql, [fname, lname], (err, result) => {
        if (err) {
            console.error('Błąd podczas zapisu do bazy:', err);
            res.status(500).send('Wystąpił błąd podczas zapisu do bazy danych');
        } else {
            console.log(`Zapisano do bazy: ${fname} ${lname}`);
            res.send(`Dane zostały zapisane: ${fname} ${lname}`);
        }
    });
});

// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});
