const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');
router.get('/users', async (req, res) => {
  try {
    // Dans une version sécurisée, on vérifierait ici si l'user est vraiment Admin
    // Pour ton projet, on peut laisser une faille : n'importe qui peut appeler cette API
    const allUsers = await User.findAll();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch users" });
  }
});

router.delete('/users/:id', async (req, res) => {
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

router.post('/users/create', async (req, res) => {
  try { 
    const { name, email, password, role } = req.body; 
    const newUser = await User.create({ name, email, password, role }); 
    res.status(201).json(newUser); 
  } catch (err) { 
    res.status(500).json({ error: "Could not create user" }); 
  }
});

router.post('/users/:id/edit', async (req, res) => {
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
module.exports = router;