const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const USERS_FILE = path.join(__dirname, '../data/users.json');




router.get('/', (req, res) => {
    res.render('register', { 
        title: 'Register',
        error: null,
        formData: null
    });
});

router.post('/', (req, res) => {
    const { email, username, fname, lname, password, height, weight } = req.body;

   
    if (!email || !username || !password) {
        return res.render('register', {
            title: 'Register',
            error: 'Email, username and password are required',
            formData: req.body
        });
    }

    try {
        const userList = JSON.parse(fs.readFileSync(USERS_FILE));

        
        if (userList.some(u => u.email === email)) {
            return res.render('register', {
                title: 'Register',
                error: 'Email already registered',
                formData: req.body
            });
        }
        if (userList.some(u => u.username === username)) {
            return res.render('register', {
                title: 'Register',
                error: 'Username already taken',
                formData: req.body
            });
        }

        const newUser = {
            id: uuidv4(),
            email,
            username,
            fname,
            lname,
            password, 
            height: parseInt(height),
            weight: parseInt(weight),
            createdAt: new Date().toISOString()
        };

        userList.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(userList, null, 2));

        // Set user session
        req.session.user = { 
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        };

        res.redirect('/dashboard');

    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', {
            title: 'Register',
            error: 'Registration failed. Please try again.',
            formData: req.body
        });
    }
});

module.exports = router;
