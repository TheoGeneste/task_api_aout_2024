const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bdd = require('../bdd');


const authentification = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (token) {
        jwt.verify(token.split(' ')[1], 'secretkey', (error, decode) => {
            if (error) {
                console.log('Erreur de vérification du token:', error);
                return res.status(401).send('token incorrect');
            } else {
                req.userId = decode.id;
                req.userMail = decode.email;
                next();
            }
        });
    } else {
        res.status(401).send('aucun token');
    }
};

router.post('/addTask',authentification, (req, res) => {
    
    const { libelle, description, etat } = req.body;
    const sql = 'INSERT INTO tasks (libelle, description, etat, user) VALUES (?, ?, ?, ?)';
    bdd.query(sql, [libelle, description, etat, req.userId], (error, result) => {
        if (error) throw error;
        res.send('Task créé');
    });
});

router.get('/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks';

    bdd.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

router.put('/tasks/:id', authentification, (req, res) => {
    const { title, description, completed } = req.body;
    const sql = 'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?';
    bdd.query(sql, [title, description, completed, req.params.id, req.userId], (err, result) => {
        if (err) throw err;
        res.send('Task mis à jour');
    });
});

router.delete('/tasks/:id', authentification, (req, res) => {
    const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    bdd.query(sql, [req.params.id, req.userId], (err, result) => {
        if (err) throw err;
        res.send('Task supprimé');
    });
});

module.exports = router;