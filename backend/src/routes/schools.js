const express = require('express');
const router = express.Router();
const School = require('../models/School');
const Application = require('../models/Application');
router.get('/schools', async (req, res) => {
  try {
    const allSchools = await School.findAll();
    res.json(allSchools);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch schools" });
  }
});

router.delete('/schools/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Application.destroy({ where: { schoolId: id } });
    const schoolToDelete = await School.findByPk(id);
    if (!schoolToDelete) {
      return res.status(404).json({ error: "School not found" });
    }
    await schoolToDelete.destroy();
    console.log(`✅ School with ID ${id} deleted.`);
    res.status(200).json({ message: "School deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Server error during deletion" });
  }
});

router.post('/schools/create', async (req, res) => {
  try {
    const { name, status, maxPlace } = req.body;
    const newSchool = await School.create({ name, status, maxPlace });
    res.status(201).json(newSchool);
  } catch (err) {
    res.status(500).json({ error: "Could not create school" });
  }
});

module.exports = router;