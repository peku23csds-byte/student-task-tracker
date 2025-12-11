// src/App.js
import React, { useEffect, useState } from 'react';

const BACKEND_URL = "http://localhost:5000/api/tasks";

function App() {
const [tasks, setTasks] = useState([]);
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [loading, setLoading] = useState(false);

// fetch tasks
async function fetchTasks() {
setLoading(true);
try {
const res = await fetch(`${BACKEND_URL}/api/tasks`);
const data = await res.json();
setTasks(data);
} catch (err) {
console.error(err);
alert('Could not load tasks');
} finally {
setLoading(false);
}
}

useEffect(() => {
fetchTasks();
}, []);

// add new task
async function addTask(e) {
e.preventDefault();
if (!title.trim()) return alert('Please enter title');
try {
const res = await fetch(`${BACKEND_URL}/api/tasks`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ title, description })
});
if (!res.ok) throw new Error('Failed to add');
const newTask = await res.json();
setTasks(prev => [newTask, ...prev]);
setTitle('');
setDescription('');
} catch (err) {
console.error(err);
alert('Could not add task');
}
}

// toggle completed
async function toggleComplete(id, current) {
try {
const res = await fetch(`${BACKEND_URL}/api/tasks/${id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ completed: !current })
});
if (!res.ok) throw new Error('Update failed');
const updated = await res.json();
setTasks(prev => prev.map(t => t._id === id ? updated : t));
} catch (err) {
console.error(err);
}
}

// delete task
async function deleteTask(id) {
if (!window.confirm('Delete this task?')) return;
try {
const res = await fetch(`${BACKEND_URL}/api/tasks/${id}`, { method: 'DELETE' });
if (!res.ok) throw new Error('Delete failed');
setTasks(prev => prev.filter(t => t._id !== id));
} catch (err) {
console.error(err);
}
}

return (
<div style={{ maxWidth: 720, margin: '30px auto', fontFamily: 'Arial, sans-serif' }}> <h1>Student Task Tracker (MERN)</h1>

```
  <form onSubmit={addTask} style={{ marginBottom: 20 }}>
    <div>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title (required)"
        style={{ width: '70%', padding: 8 }}
      />
    </div>
    <div style={{ marginTop: 8 }}>
      <input
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description (optional)"
        style={{ width: '70%', padding: 8 }}
      />
    </div>
    <div style={{ marginTop: 8 }}>
      <button type="submit" style={{ padding: '8px 12px' }}>Add Task</button>
    </div>
  </form>

  {loading ? <p>Loading tasks...</p> : (
    <div>
      {tasks.length === 0 && <p>No tasks yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task._id} style={{
            padding: 10, border: '1px solid #ddd', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: task.completed ? 'normal' : 'bold', textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </div>
              {task.description && <div style={{ fontSize: 13, color: '#555' }}>{task.description}</div>}
            </div>
            <div>
              <button onClick={() => toggleComplete(task._id, task.completed)} style={{ marginRight: 8 }}>
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
);
}

export default App;
