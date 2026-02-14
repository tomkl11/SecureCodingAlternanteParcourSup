const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/roleMiddleware');
const User = require('../models/User');
const Application = require('../models/Application');
const validator = require('validator');
router.get('/users', authorizeAdmin, async (req, res) => {
  try {
    const allUsers = await User.findAll();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch users" });
  }
});

router.delete('/users/:id',authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Application.destroy({ where: { userId: id } });
    // On cherche l'utilisateur
    const userToDelete = await User.findByPk(id);
    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }
    await userToDelete.destroy();
    console.log(`✅ User with ID ${id} deleted.`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Server error during deletion" });
  }
});

router.post('/users/create',authorizeAdmin, async (req, res) => {
  try { 
    const { name, email, password, role } = req.body; 
    const newUser = await User.create({ name, email, password, role }); 
    await newUser.save();
    res.status(201).json(newUser); 
  } catch (err) { 
    res.status(500).json({ error: "Could not create user" }); 
  }
});

router.post('/users/:id/edit',authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email} = req.body;
    const cleanName = validator.escape(name);
    const userToEdit = await User.findByPk(id);
    if (!userToEdit) {
      return res.status(404).json({ error: "User not found" });
    }
    userToEdit.name = cleanName
    userToEdit.email = email 
    await userToEdit.save();
    res.status(200).json(userToEdit);
  } 
  catch (err) {
    res.status(500).json({ error: "Could not update user" });
  }
  
});

router.post('/users/:id/switchRole', authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const userToEdit = await User.findByPk(id);
    if (!userToEdit) {
      return res.status(404).json({ error: "User not found" });
    }
    const oldRole = userToEdit.role;
    userToEdit.role = oldRole === 'ADMIN' ? 'USER' : 'ADMIN';
    await userToEdit.save();

    console.log(`[AUTH] Role switched for ${userToEdit.name}: ${oldRole} -> ${userToEdit.role}`);
    res.status(200).json(userToEdit);
  } catch (err) {
    res.status(500).json({ error: "Could not switch user role" });
  }
});
module.exports = router;