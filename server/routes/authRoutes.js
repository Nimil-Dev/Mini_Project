const express = require('express');
const router = express.Router();
const User = require('../models/User');

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    // Create new user
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // Clean user object to return (excludes password)
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar
    };

    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: err.message || 'Server error during registration' });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Check password
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Clean user object to return (excludes password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };

    res.status(200).json({ message: 'Login successful', user: userResponse });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: err.message || 'Server error during login' });
  }
});

// UPDATE PROFILE ROUTE
router.put('/profile/:id', async (req, res) => {
  try {
    const { name, role, avatar } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, role, avatar },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
    }

    const userResponse = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar
    };

    res.json({
        message: "Profile updated successfully",
        user: userResponse
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Server error during profile update" });
  }
});

module.exports = router;