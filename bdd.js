const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todolist'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('bdd OK');
});

module.exports = db;