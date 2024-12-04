const jwt = require('jsonwebtoken');

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
                req.role = decode.role;
                next();
            }
        });
    } else {
        res.status(401).send('aucun token');
    }
};

module.exports = {authentification};