import { useState , useEffect } from 'react';
import GradeAssignments from './GradeAssignments';
import MarksEntry from './MarksEntry';
import Reports from './Reports';

export default function Grading({ defaultSection = 'grade-assignments' }) {
  const [activeSection, setActiveSection] = useState(defaultSection);

  useEffect(() => {
    setActiveSection(defaultSection);
  }, [defaultSection]);

  return (
    <>
      {activeSection === 'grade-assignments' && (
        <GradeAssignments setActiveSection={setActiveSection} />
      )}
      {activeSection === 'marks-entry' && <MarksEntry />}
      {activeSection === 'reports' && <Reports />}
    </>
  );
}

