require('dotenv').config(); //Loading Environnement Server
const express = require('express');                 
const mongoose = require('mongoose');               
const User = require('./Models/User');                  
const app = express();  
const port = 3000;

//Connect to th database
mongoose
.connect(process.env.DB_CONNECTION, {  })
.then(() => {
    console.log('Connected to the database');
})  
.catch((error) => {
    console.error('Error connecting to the database:', error);
});
//Middleware
app.use(express.json());

//Get route: Return all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//POST route: Add a new user to the database
app.post('/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (error) {  
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });


// PUT route: Edit a user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, password }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//DELETE route: Remove all users
app.delete('/users', async (req, res) => {
    try {
        await User.deleteMany();
        res.json({ message: 'All users deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});                 

// Starting Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });
