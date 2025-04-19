import { useState, useEffect } from "react";
import "./CourseA.css";

function CourseA() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [position, setPosition] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchQueue = async () => {
    const response = await fetch("http://127.0.0.1:5000/get_queue/Course A");
    const data = await response.json();
    setQueue(data);
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(() => {
      fetchQueue();
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:5000/join_queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, course: "Course A", group_size: groupSize }),
    });

    const data = await response.json();
    if (response.ok) {
      setPosition(data.position);
      fetchQueue();
    } else {
      alert(data.message);
    }
  };

  const moveUp = async (id) => {
    await fetch(`http://127.0.0.1:5000/move_up/${id}`, { method: "POST" });
    fetchQueue();
  };

  const moveDown = async (id) => {
    await fetch(`http://127.0.0.1:5000/move_down/${id}`, { method: "POST" });
    fetchQueue();
  };

  const deleteEntry = async (id) => {
    await fetch(`http://127.0.0.1:5000/delete_entry/${id}`, { method: "POST" });
    fetchQueue();
  };
  

  const formatTime = (date, offsetMinutes = 0) => {
    const newDate = new Date(date.getTime() + offsetMinutes * 60000);
    return newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="course-container">
      <h1>Join the Queue - Course A</h1>

      {/* 🕰️ Current Time Display */}
      <p><strong>Current Time:</strong> {formatTime(currentTime)}</p>

      <form onSubmit={handleSubmit} className="queue-form">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Group Size (Max 4)"
          value={groupSize}
          onChange={(e) => setGroupSize(Math.min(Math.max(e.target.value, 1), 4))}
          required
        />
        <button type="submit">Join Queue</button>
      </form>

      {position && <p>Your position in the queue: {position}</p>}

      <h2>Current Queue</h2>

      {queue.length === 0 ? (
        <p>No golfers in queue right now.</p>
      ) : (
        <ul>
          {queue.map((entry, index) => {
            const waitTime = index * 8;
            const estimatedTeeTime = formatTime(currentTime, waitTime);

            return (
              <li key={index}>
                {entry.name} ({entry.group_size} players) — Est. Tee Time: {estimatedTeeTime} — Wait Time: {waitTime} mins
                <div className="admin-buttons">
                  <button onClick={() => moveUp(entry.id)}>⬆️ Move Up</button>
                  <button onClick={() => moveDown(entry.id)}>⬇️ Move Down</button>
                  <button onClick={() => deleteEntry(entry.id)}>🗑️ Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CourseA;
