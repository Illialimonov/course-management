import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import {
  AssignmentIn,
  createAssignment,
  deleteAssignment,
  insertGrades,
} from "./api/service/TeacherService";
import { useParams } from "react-router-dom";
import { UserContext } from "./context/UserContext";

interface ColumnIn {
  title: React.ReactNode;
  dataIndex: string;
  key: string;
}

interface GradesIn {
  assignment: AssignmentIn[];
  data: any[];
}

const StudentGrades = ({
  assignment: assignments,
  data: initialData,
}: GradesIn) => {
  const context = useContext(UserContext);
  const id = context?.user?._id; // destructure user and setUser

  const trueData = initialData.find((student) => student.id === id);

  console.log(trueData);

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
      title: assignment.assignmentName, // Just display the assignment name when editModeOn is false,
      dataIndex: cleanedAssName,
      key: assignment._id,
    });
  }

  columns.push({
    title: "Average",
    dataIndex: "average",
    key: "average",
  });

  return (
    <div>
      <h2>Student Grades in Class</h2>
      <Table columns={columns} dataSource={[trueData]} />
    </div>
  );
};

export function removeWhitespaces(str: string) {
  return str.replace(/\s+/g, ""); // Removes all whitespaces
}

export default StudentGrades;
