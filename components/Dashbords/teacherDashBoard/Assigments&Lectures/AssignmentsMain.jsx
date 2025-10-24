// components/TeacherDashboard/Assigments&Lectures/AssignmentsMain.jsx
import { useState, useEffect } from "react";
import Assignments from "./assigments";
import Lectures from "./Lecture";

export default function AssignmentsMain({ defaultSection = "assignments" }) {
  const [activeSection, setActiveSection] = useState(defaultSection);

  useEffect(() => {
    setActiveSection(defaultSection);
  }, [defaultSection]);

  return (
    <>
      {activeSection === "assignments" && <Assignments setActiveSection={setActiveSection} />}
      {activeSection === "lectures" && <Lectures setActiveSection={setActiveSection} />}
    </>
  );
}