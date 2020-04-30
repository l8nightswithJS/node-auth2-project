const router = require('express').Router();

const bcrypt = require('bcrypt');

const Users = require('../users/users-model.js');

const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets.js')

router.post('/register', (req, res) => {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.post('/login', (req, res) => {
    let { username, password} = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);

                res.status(200).json({ message: `Welcome ${user.username}!`, jwt_token: token});
            } else {
                res.status(401).json({ message: 'invalid credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.delete('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).json({ message: 'error logging out:', error: err });
            } else {
                res.json({ message: 'logged out' });
            }
        });
    } else {
        res.end();
    }
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    };
    const secret = secrets.jwt_secret;

    const options = {
        expiresIn: '30min'
    };

    return jwt.sign(payload, secret, options);
}

module.exports = router;