import { useState, useEffect } from "react";
import "./Admin.css";

function Admin() {
  const [queue, setQueue] = useState([]);

  const fetchQueue = async () => {
    const response = await fetch("http://127.0.0.1:5000/get_queue/Course A");
    const data = await response.json();
    setQueue(data);
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const deleteEntry = async (id) => {
    await fetch(`http://127.0.0.1:5000/delete_entry/${id}`, { method: "DELETE" });
    fetchQueue();
  };

  const moveUp = async (id) => {
    await fetch(`http://127.0.0.1:5000/move_up/${id}`, { method: "POST" });
    fetchQueue();
  };

  return (
    <div className="admin-container">
      <h1>Admin Queue Management - Course A</h1>

      {queue.length === 0 ? (
        <p>No golfers in queue right now.</p>
      ) : (
        <ul>
          {queue.map((entry, index) => (
            <li key={index}>
              {entry.name} ({entry.group_size} players) — Position: {index + 1}
              <div className="admin-buttons">
                <button onClick={() => moveUp(entry.id)}>Move Up</button>
                <button onClick={() => deleteEntry(entry.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;
