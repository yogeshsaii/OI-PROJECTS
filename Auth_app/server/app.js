const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Mock database (replace with a real database like MongoDB or SQL)
const users = [];

// Routes

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Register route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  console.log('Register attempt:', username, password); // Logging for debugging

  if (!username || !password) {
    console.log('Registration failed: Missing username or password');
    return res.status(400).send('Missing username or password');
  }

  // Check if username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    console.log('Registration failed: Username already exists');
    return res.status(409).send('Username already exists');
  }

  // Hash password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.log('Error hashing password', err);
      return res.status(500).send('Error hashing password');
    }

    // Store user in mock database
    users.push({
      username: username,
      password: hashedPassword
    });

    console.log('User registered successfully:', username);

    // Send success message and clear input fields on client-side
    res.send(`<script>alert('Hi ${username}, your registration is completed. Login now.'); window.location.href = '/login';</script>`);
  });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt:', username, password); // Logging for debugging

  if (!username || !password) {
    console.log('Login failed: Missing username or password');
    return res.status(400).send('Missing username or password');
  }

  // Find user in mock database
  const user = users.find(user => user.username === username);
  if (!user) {
    console.log('Login failed: User not found');
    return res.status(404).send('User not found');
  }

  // Compare hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.log('Error comparing password', err);
      return res.status(500).send('Error comparing password');
    }

    if (!result) {
      console.log('Login failed: Incorrect password');
      return res.status(401).send('Incorrect password');
    }

    // Set session cookie
    req.session.username = username;
    console.log('User logged in successfully:', username);
    res.redirect('/dashboard');
  });
});

// Dashboard route (secured route)
app.get('/dashboard', (req, res) => {
  if (!req.session.username) {
    console.log('Access denied: User not authenticated');
    return res.redirect('/login');
  }
  console.log('Dashboard accessed by:', req.session.username);
  res.send(`Welcome to the dashboard, ${req.session.username}!`);
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log('Error logging out', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
