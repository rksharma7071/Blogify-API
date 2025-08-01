const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');;


async function handleAuthSignUp(req, res) {
  const { username, email, password, first_name, last_name } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email or username already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.VITE_JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
}
// async function handleAuthLogin(req, res) {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: 'User not found.' });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: 'Password is incorrect.' });

//     // Sign JWT token
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.VITE_JWT_SECRET, {
//       expiresIn: '1d',
//     });

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// }; 

async function handleAuthLogin(req, res) {
  const { email, password } = req.body;

  console.log("Login attempt:", { email }); // ✅ Debug log

  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password." });
  }

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ msg: "User not found." });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password for:", email);
      return res.status(400).json({ msg: "Password is incorrect." });
    }

    // 3. Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in .env file");
      return res.status(500).json({ msg: "Server config error." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Respond with token and user info
    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
}

module.exports = {
  handleAuthSignUp,
  handleAuthLogin
}