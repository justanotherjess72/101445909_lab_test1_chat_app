const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000; 

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve the HTML files
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '/chat.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/signup.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
});
