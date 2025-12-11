import React, { useState, useEffect } from "react";

function TaskForm({ refreshTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studentId, setStudentId] = useState("");

  const [students, setStudents] = useState([]);

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_URL}/api/students`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    if (!studentId) {
      alert("Please select a student");
      return;
    }

    await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        studentId   // ✅ FIXED (backend expects studentId)
      }),
    });

    // Clear form inputs
    setTitle("");
    setDescription("");
    setStudentId("");

    refreshTasks(); // Reload tasks
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
        <option value="">Select Student</option>
        {students.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;