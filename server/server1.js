import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ---------- IN-MEMORY DATABASE ---------- //
let students = [
  { id: 1, name: "John Doe", email: "john@example.com", rollNumber: 101 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", rollNumber: 102 },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", rollNumber: 103 },
  { id: 4, name: "Bob Brown", email: "bob@example.com", rollNumber: 104 },
  { id: 5, name: "Charlie Davis", email: "charlie@example.com", rollNumber: 105 }
];

let tasks = []; // Start empty, no default tasks

// ---------- STUDENT ROUTES ---------- //
// Get all students
app.get("/api/students", (req, res) => {
  res.json(students);
});

// ---------- TASK ROUTES ---------- //
// Get tasks for a student
app.get("/api/students/:id/tasks", (req, res) => {
  const studentId = parseInt(req.params.id);
  const studentTasks = tasks.filter(t => t.studentId === studentId);
  res.json(studentTasks);
});

// Add a task for a student
app.post("/api/students/:id/tasks", (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = students.find(s => s.id === studentId);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const { title } = req.body;
  const newTask = {
    id: tasks.length + 1,
    studentId,
    title,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update task (toggle completed)
app.put("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const { title, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) return res.status(404).json({ message: "Task not found" });

  const deletedTask = tasks.splice(index, 1);
  res.json(deletedTask[0]);
});

// ---------- START SERVER ---------- //
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
