import React, { useEffect, useState } from 'react';
import AddStudent from "./AddStudent";
import TaskForm from "./TaskForm";  // USE THE CORRECT TASK FORM

const BACKEND_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(BACKEND_URL);
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="App" style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Task Manager</h1>

      {/* Go to Add Student Page */}
      <button
        onClick={() => window.location.href = "/add-student"}
        style={{ padding: "10px 20px", marginBottom: "20px" }}
      >
        Add New Student
      </button>

      {/*  USE TaskForm INSTEAD OF BROKEN FORM */}
      <TaskForm refreshTasks={fetchTasks} />

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li key={task._id} style={{ marginBottom: "15px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p><strong>Student:</strong> {task.student?.name || "No student"}</p>

              <button
                onClick={() => handleDeleteTask(task._id)}
                style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "3px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;