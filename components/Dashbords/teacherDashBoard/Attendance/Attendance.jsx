import { useState, useEffect } from "react";
import MarkAttendance from "./MarkAttendance";
import AttendanceReports from "./AttendanceReports/AttendanceReports";

export default function Attendance({ defaultSection = "reports" }) {
  const [activeSection, setActiveSection] = useState(defaultSection);

  useEffect(() => {
    setActiveSection(defaultSection);
  }, [defaultSection]);

  return (
    <>
      {activeSection === "mark" && (
        <MarkAttendance setActiveSection={setActiveSection} />
      )}
      {activeSection === "reports" && (
        <AttendanceReports setActiveSection={setActiveSection} />
      )}
    </>
  );
}

