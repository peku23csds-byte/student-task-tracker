const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET /api/students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/students  (create a student)
router.post("/", async (req, res) => {
  try {
    const { name, email, rollNumber } = req.body;
    const student = new Student({ name, email, rollNumber });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;