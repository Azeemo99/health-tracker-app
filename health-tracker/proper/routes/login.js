const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const USERS_FILE = path.join(__dirname, '../data/users.json');

// GET login page
router.get('/', (req, res) => {
    res.render('login', {
        title: 'Login',
        error: null,
        formData: null
    });
});

// POST login form
router.post('/', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('login', {
            title: 'Login',
            error: 'Username and password are required',
            formData: req.body
        });
    }

    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE));
        const user = users.find(u => u.username === username);
      
        if (!user || user.password !== password) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid username or password',
                formData: req.body
            });
        }

    
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        res.render('login', {
            title: 'Login',
            error: 'Login failed. Please try again.',
            formData: req.body
        });
    }
});

module.exports = router;