require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

//Refresh tokens stored in a variable for demonstration purposes. 
//In production, refresh tokens would be stored in a db
const refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null){
        return res.sendStatus(401);
    }
    if (!refreshToken.includes(refreshToken)){
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err){
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken({name: user.name});
        res.json({ accessToken: accessToken });
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { username: username };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    res.status(201).json({ accessToken: accessToken, refreshToken: refreshToken });
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}

app.listen(3001, () => console.log('auth server started'));