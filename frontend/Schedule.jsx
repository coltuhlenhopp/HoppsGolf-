import { Link } from "react-router-dom";
import "./Schedule.css";
import courseAImage from "./courseA.png";
import courseBImage from "./courseB.png";

function Schedule() {
  return (
    <div className="schedule-container">
      <h1>Schedule a Tee Time</h1>
      <p>Select a golf course to view available tee times and make a booking.</p>

      <div className="courses-grid">
        {/* Course A */}
        <Link to="/schedule/course-a" className="course-link">
          <div className="course-card">
            <img src={courseAImage} alt="Course A" className="course-image" />
            <h2>Hopps Golf Course - Course A</h2>
            <p>Challenge yourself on our beautiful desert-style championship course.</p>
            <button className="schedule-button">View Tee Times</button>
          </div>
        </Link>

        {/* Course B */}
        <Link to="/schedule/course-b" className="course-link">
          <div className="course-card">
            <img src={courseBImage} alt="Course B" className="course-image" />
            <h2>Hopps Golf Course - Course B</h2>
            <p>A relaxing layout with scenic water hazards and lush fairways.</p>
            <button className="schedule-button">View Tee Times</button>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Schedule;
