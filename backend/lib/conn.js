const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'documents',
    password: 'documents',
    database: 'documents'
});

module.exports = connection;