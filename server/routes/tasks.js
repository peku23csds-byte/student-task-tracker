const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Create task
// Expects { title, description, student } where student is student _id
router.post("/", async (req, res) => {
  try {
    const { title, description = "", student } = req.body;
    if (!title || !student) return res.status(400).json({ error: "Title and student required" });

    const task = new Task({ title, description, student });
    await task.save();
    // populate student in response
    await task.populate("student").execPopulate?.() || await task.populate("student");
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tasks (populated)
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("student").sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update (toggle or any field)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("student");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;