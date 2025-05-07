const User = require('../models/user')

async function handleGetAllUsers(req, res) {
  const users = await User.find({});
  return res.json(users);
}

async function handleCreateNewUser(req, res) {
  try {
    const body = req.body;

    if (!body.username || !body.email || !body.password || !body.first_name || !body.last_name || !body.role) {
      return res.status(400).json({ msg: "All fields are required..." });
    }

    const result = await User.create({
      username: body.username,
      email: body.email,
      password: body.password,
      first_name: body.first_name,
      last_name: body.last_name,
      role: "author",
    });

    console.log("Result: ", result);
    return res.status(201).json({ msg: "User created successfully", user: result });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleGetUserUinsgId(req, res) {
  const user = await User.findById(req.params.id);
  return res.json(user);
}

async function handleUpdateUserUsingId(req, res) {
  const user = req.body;
  await User.findByIdAndUpdate(req.params.id, user);
  return res.json({ status: "success" });
}

async function handleDeleteUserUsingId(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ status: "success", message: "User deleted successfully" });
}

module.exports = {
  handleGetAllUsers,
  handleCreateNewUser,
  handleGetUserUinsgId,
  handleUpdateUserUsingId,
  handleDeleteUserUsingId
}