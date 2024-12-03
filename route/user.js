const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bdd = require('../bdd');

router.post('/inscription', (req, res) => {
    const { nom, prenom, email, password } = req.body;
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = 'INSERT INTO users (nom, prenom, email, password) VALUES (?, ?, ?, ?)';
    bdd.query(sql, [nom, prenom, email, hashedPassword], (err, result) => {
        if (err) {
            res.status(500).send('Erreur lors de l\'inscription');
        };
        res.send('User inscrit');
    });
});

router.get('/getAllUsers', (req, res) => {

const getAllUsers = 'SELECT * FROM users';
bdd.query(getAllUsers, (err, results) => {
    if (err) throw err;
    res.json(results);
});
});

router.get('/getUserById/:id', (req, res) => {
    const { id } = req.params;
    const getUserById = 'SELECT * FROM users WHERE idUser =?';

    bdd.query(getUserById, [id], (err, result) => {

        if (err) throw err;
        res.json(result);
    });
});

router.post('/connexion', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    bdd.query(sql, [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            
            console.log(bcrypt.compareSync(password, user.password));
            
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result) {
                    const token = jwt.sign({ id: user.idUser, email : user.email, "message" : "ceci est un token" }, 'secretkey', { expiresIn: '1h' });
                    res.json({ token });
                } else {
                    res.status(401).send('password incorrect');
                }
            });
        } else {
            res.status(404).send('user introuvable');
        }
    });
});

module.exports = router;