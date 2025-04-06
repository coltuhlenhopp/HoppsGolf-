import { Link } from "react-router-dom";
import "./Home.css";
import golfImage from "./image.png";

function Home() {
  return (
    <div className="home-container">
      <nav className="top-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/contacts" className="nav-link">Contacts</Link>
        <Link to="/schedule" className="nav-link">Schedule</Link>
        <Link to="/about" className="nav-link">About</Link>
      </nav>

      <img src={golfImage} alt="Golf Course" className="home-image" />
      <div className="home-content">
        <h1>Welcome to Hopps Golf</h1>
        <p>Your premier destination for dynamic and efficient golf course management.</p>
        <p>Book a tee time, manage your schedule, and experience the future of golf.</p>
        
        <div className="home-buttons">
          <Link to="/schedule">
            <button className="home-button">Schedule a Tee Time</button>
          </Link>
          <Link to="/contacts">
            <button className="home-button">Go to Contact Page</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
