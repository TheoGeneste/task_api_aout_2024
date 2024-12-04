const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bdd = require('../bdd');
const auth = require('../middleware/auth');

router.post('/addTask',auth.authentification, (req, res) => {
    
    const { libelle, description, etat } = req.body;
    const sql = 'INSERT INTO tasks (libelle, description, etat, user) VALUES (?, ?, ?, ?)';
    bdd.query(sql, [libelle, description, etat, req.userId], (error, result) => {
        if (error) throw error;
        res.send('Task créé');
    });
});

router.get('/tasks',auth.authentification, (req, res) => {
    let sql = "";

    if (req.role == "admin") {
        sql = 'SELECT * FROM tasks LEFT JOIN users ON idUser=user ;';
    }else{
        sql = 'SELECT * FROM tasks where user = ?;';
    }

    bdd.query(sql,[req.userId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

router.put('/tasks/:id', auth.authentification, (req, res) => {
    const { title, description, completed } = req.body;
    const sql = 'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?';
    bdd.query(sql, [title, description, completed, req.params.id, req.userId], (err, result) => {
        if (err) throw err;
        res.send('Task mis à jour');
    });
});

router.delete('/tasks/:id', auth.authentification, (req, res) => {
    const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    bdd.query(sql, [req.params.id, req.userId], (err, result) => {
        if (err) throw err;
        res.send('Task supprimé');
    });
});

module.exports = router;