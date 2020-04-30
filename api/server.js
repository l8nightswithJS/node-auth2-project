
const express = require('express');
const helmet = require ('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authRouter = require('../auth/authRouter.js');
const usersRouter = require('../users/users-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const restricted = require('../auth/restricted-middleware');

server.use('/api/auth', authRouter);
server.use('/api/users', restricted, usersRouter);

server.get('/', (req, res) => {
    res.send("Server running!!");
});

server.get('/token', (req, res) => {
    const payload = {
        subject: 'thisuser',
        userid: 'eddiejdev',
        favoriteMovie: 'potter'
    };

    const secret = process.env.JWT_SECRET || 'secretofsecrets'

    const options = {
        expiresIn: '30min'
    }

    const token = jwt.sign(payload, secret, options);

    res.json(token)
});

module.exports = server;