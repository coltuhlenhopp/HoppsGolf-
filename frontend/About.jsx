import "./About.css";
import headshot from "./headshot.jpg"; // Make sure to place your headshot image in the src folder

function About() {
  return (
    <div className="about-container">
      <h1>About Hopps Golf</h1>

      <img src={headshot} alt="Colt Uhlenhopp" className="headshot" />

      <p>
        My name is Colt Uhlenhopp, and I am a Computer Science student at Grand Canyon University.
        As the sole creator of this startup and my senior capstone project, I am passionate about merging
        technology with the sport I love—golf.
      </p>

      <h2>Innovating Tee Time Scheduling</h2>
      <p>
        Hopps Golf is my innovative take on tee time scheduling, designed to improve efficiency and accessibility.
        Traditional scheduling systems are outdated and inefficient, creating barriers for new players and causing
        slow play. My goal is to modernize this process with a dynamic, real-time booking system.
      </p>

      <h2>Experience & Passion</h2>
      <p>
        Having worked at a golf course for several years, I have firsthand experience with the challenges
        faced by both players and course managers. This project is my way of integrating my love for technology
        into my love for golf, creating a smarter, more intuitive way to book tee times and enhance the overall experience.
      </p>

      <h2>Contact Information</h2>
      <p>
        📧 coltuhlenhopp@gmail.com <br />
        📞 218-760-1785
      </p>
    </div>
  );
}

export default About;
