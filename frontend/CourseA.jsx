import { useState, useEffect } from "react";
import "./CourseA.css";

function CourseA() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [position, setPosition] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch queue data from the backend
  const fetchQueue = async () => {
    const response = await fetch("http://127.0.0.1:5000/get_queue/Course A");
    const data = await response.json();
    setQueue(data);
  };

  // Live clock updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll the backend queue every 5 seconds
  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to format time
  const formatTime = (date, extraMinutes = 0) => {
    const newDate = new Date(date.getTime() + extraMinutes * 60000);
    return newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle form submission
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

  return (
    <div className="course-container">
      <h1>Join the Queue - Course A</h1>

      {/* Current live time */}
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
          {queue.map((entry, index) => (
            <li key={index}>
              {entry.name} ({entry.group_size} players) — Est. wait: {entry.wait_time} mins — Est. Tee Time: {formatTime(currentTime, entry.wait_time)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseA;
