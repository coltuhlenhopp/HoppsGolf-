
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Home";
import Contacts from "./Contacts";
import Schedule from "./Schedule";
import "./App.css";
import ContactForm from "./ContactForm";
import About from "./About";
import CourseA from "./CourseA";
import CourseB from "./CourseB";
import Admin from "./Admin";


function App() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({});

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();
    setContacts(data.contacts);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentContact({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (contact) => {
    if (isModalOpen) return;
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    fetchContacts();
  };

  return (
    <Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/contacts">Contacts</Link>
    <Link to="/schedule">Schedule</Link>
    <Link to="/about">About</Link>  {/* <-- Added this */}
  </nav>
  
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/contacts" element={
      <>
        <Contacts contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate} />
        <button onClick={openCreateModal}>Create New Contact</button>
        {isModalOpen && <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <ContactForm existingContact={currentContact} updateCallback={onUpdate} />
          </div>
        </div>}
      </>
    } />
    <Route path="/schedule" element={<Schedule />} />
    <Route path="/about" element={<About />} />  {/* <-- Added this */}
    <Route path="/schedule/course-a" element={<CourseA />} />
    <Route path="/schedule/course-b" element={<CourseB />} />
    <Route path="/admin" element={<Admin />} />

  </Routes>
</Router>

);

}

export default App;

