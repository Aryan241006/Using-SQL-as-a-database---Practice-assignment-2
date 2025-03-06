// Load environment variables
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

connection.connect(error => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Successfully connected to the MySQL database.');
});

app.get('/', (req, res) => {
    res.send('Express Server with MySQL Connection is running!');
});

app.get('/test-db', (req, res) => {
    connection.query('SELECT 1 + 1 AS solution', (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Database query failed');
        }
        res.send(`Database query result: ${results[0].solution}`);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
    connection.end();
    console.log('MySQL connection closed');
    process.exit();
});