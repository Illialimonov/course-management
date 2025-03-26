import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import {
  AssignmentIn,
  createAssignment,
  deleteAssignment,
  insertGrades,
} from "./api/service/TeacherService";
import { useParams } from "react-router-dom";

interface ColumnIn {
  title: React.ReactNode;
  dataIndex: string;
  key: string;
  render?: (value: any, record: any) => React.ReactNode;
}

interface GradesIn {
  assignment: AssignmentIn[];
  data: any[];
}

const StudentGrades = ({
  assignment: assignments,
  data: initialData,
}: GradesIn) => {
  const [newAssignmentName, setNewAssignmentName] = useState<string>();
  const [allChanges, setAllChanges] = useState<
    Array<{ studentId: string; assignmentId: string; grade: number }>
  >([]);
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any[]>(initialData || []);
  const [editModeOn, setEditModeOn] = useState(false);

  const createNewAssignment = async (newAssignmentName: string) => {
    if (id) {
      await createAssignment(id, newAssignmentName);
      setNewAssignmentName("");
      window.location.reload(); // ✅ Reload the page after creating the assignment
    } else {
      console.error("No course ID found in URL");
    }
  };

  const handleAssignmentDeletion = async (assignmentId: string) => {
    await deleteAssignment(assignmentId);
    window.location.reload();
  };

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]); // React when `initialData` changes

  //TODO
  const handleSave = (
    studentId: string,
    assignmentId: string,
    newGrade: number,
    cleanedAssName: string
  ) => {
    setData((data) =>
      data.map((student) =>
        student.id === studentId
          ? { ...student, [cleanedAssName]: newGrade }
          : student
      )
    );

    setAllChanges([
      ...allChanges,
      { studentId, assignmentId, grade: newGrade },
    ]);

    console.log(allChanges);

    // Logic to save the edited value (for example, make an API call or update the state)
    // Optionally, you can reset the editing state here:
    setEditingCell(null);
  };

  const [editingCell, setEditingCell] = useState<{
    studentId: string;
    assignmentId: string;
  } | null>(null);
  const [newGrade, setNewGrade] = useState<number>();

  let columns: ColumnIn[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  for (let assignment of assignments) {
    const cleanedAssName = removeWhitespaces(assignment.assignmentName);

    columns.push({
      title: editModeOn ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{assignment.assignmentName}</span>
          <Button
            size="small"
            style={{ marginLeft: "8px" }} // Add margin to space out the button
            onClick={() => handleAssignmentDeletion(assignment._id)} // Pass a function reference
          >
            🗑️
          </Button>
        </div>
      ) : (
        assignment.assignmentName // Just display the assignment name when editModeOn is false
      ),
      dataIndex: cleanedAssName,
      key: assignment._id,

      render: (value, record) => {
        const isModified = allChanges.some(
          (cell) =>
            cell.studentId === record.id && cell.assignmentId === assignment._id
        );

        return editingCell?.studentId === record.id &&
          editingCell?.assignmentId === assignment._id ? (
          <>
            <Input
              defaultValue={value}
              min={0} // Minimum value (0)
              max={100} // Maximum value (100)
              onChange={(e: any) => {
                const newValue = Math.min(100, Math.max(0, e.target.value)); // Ensure the value stays between 0 and 100
                setNewGrade(newValue);
              }} // Use e.target.value to get the new input value
              style={{
                width: "50px",
              }}
            />
            <Button
              size="small"
              type="primary"
              onClick={() =>
                handleSave(record.id, assignment._id, newGrade!, cleanedAssName)
              }
              style={{ marginLeft: "8px" }} // Optional: Add marginLeft to the button for space between the text and button
            >
              Save
            </Button>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                color: isModified ? "blue" : "black", // Change color only if this specific cell was modified
              }}
            >
              {value}
            </span>

            {editModeOn && (
              <Button
                size="small"
                onClick={() =>
                  setEditingCell({
                    studentId: record.id,
                    assignmentId: assignment._id,
                  })
                }
              >
                Edit
              </Button>
            )}
          </div>
        );
      },
    });
  }

  columns.push({
    title: "Average",
    dataIndex: "average",
    key: "average",
  });

  const handleSavingGrades = async () => {
    await insertGrades(allChanges);
    setAllChanges([]); // Clear changes after saving
    // window.location.reload(); //
  };

  return (
    <div>
      <h2>Student Grades in Class</h2>
      <Table columns={columns} dataSource={data} />
      <Input
        defaultValue={"Assignment Name Example"}
        onChange={(e: any) => {
          setNewAssignmentName(e.target.value);
        }} // Use e.target.value to get the new input value
        style={{ width: "250px" }} // Set width of the input field
      />
      <Button
        size="large"
        onClick={() => createNewAssignment(newAssignmentName!)}
      >
        Add Assignment
      </Button>
      {editingCell && (
        <Button size="large" onClick={() => setEditingCell(null)}>
          Cancel Editing
        </Button>
      )}
      {allChanges && (
        <Button size="large" onClick={handleSavingGrades}>
          Save Changes
        </Button>
      )}
      <Button size="large" onClick={() => setEditModeOn(!editModeOn)}>
        {editModeOn ? "Exit Edit Mode" : "Go Edit Mode"}
      </Button>
    </div>
  );
};

export function removeWhitespaces(str: string) {
  return str.replace(/\s+/g, ""); // Removes all whitespaces
}

export default StudentGrades;
