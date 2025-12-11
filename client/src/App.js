import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

function App() {
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState({});
  const [newTaskAll, setNewTaskAll] = useState("");

  useEffect(() => {
    const fetchStudentsAndTasks = async () => {
      const res = await fetch(`${API_URL}/students`);
      const data = await res.json();
      setStudents(data);

      const tasksObj = {};
      for (const student of data) {
        const tRes = await fetch(`${API_URL}/students/${student.id}/tasks`);
        tasksObj[student.id] = await tRes.json();
      }
      setTasks(tasksObj);
    };
    fetchStudentsAndTasks();
  }, []);

  const addTaskToAll = async () => {
    if (!newTaskAll) return;
    const newTasksObj = { ...tasks };

    for (const student of students) {
      const res = await fetch(`${API_URL}/students/${student.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskAll })
      });
      const addedTask = await res.json();
      if (!newTasksObj[student.id]) newTasksObj[student.id] = [];
      newTasksObj[student.id].push(addedTask);
    }

    setTasks(newTasksObj);
    setNewTaskAll("");
  };

  const toggleComplete = async (task) => {
    await fetch(`${API_URL}/tasks/${task.id}`, { method: "PUT" });
    setTasks(prev => {
      const updated = { ...prev };
      updated[task.studentId] = updated[task.studentId].map(t =>
        t.id === task.id ? { ...t, completed: !t.completed } : t
      );
      return updated;
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Student Task Tracker</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Task for all students"
          value={newTaskAll}
          onChange={e => setNewTaskAll(e.target.value)}
        />
        <button onClick={addTaskToAll} style={{ marginLeft: 10 }}>Add Task to All</button>
      </div>

      {students.map(student => (
        <div key={student.id} style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
          <h2>{student.name}</h2>
          {tasks[student.id] && tasks[student.id].length > 0 ? (
            <ul>
              {tasks[student.id].map(task => (
                <li key={task.id} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                  {task.title}
                  <button onClick={() => toggleComplete(task)} style={{ marginLeft: 10 }}>
                    {task.completed ? "Undo" : "Done"}
                  </button>
                </li>
              ))}
            </ul>
          ) : <p>No tasks yet.</p>}
        </div>
      ))}
    </div>
  );
}

export default App;
