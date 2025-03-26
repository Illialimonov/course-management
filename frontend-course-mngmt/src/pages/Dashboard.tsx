import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Breadcrumb, Col, Divider, Layout, Menu, Row, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import useFetchUsers from "../api/hooks/useFetchUsers";
import { StudentIn } from "../api/service/userService";
import Card from "antd/es/card/Card";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

export interface UserIn {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO format date
  email: string;
  gender: "Male" | "Female" | "Other"; // Use a union type for gender if it's limited to specific values
  phoneNumber: string;
  courses: string[]; // Assuming courses is an array of course IDs or names
}

export interface TeacherIn {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO format date
  email: string;
  gender: "Male" | "Female" | "Other"; // Use a union type for gender if it's limited to specific values
  phoneNumber: string;
  department: string;
  courses: string[]; // Assuming courses is an array of course IDs or names
}

export interface CourseIn {
  _id: string;
  courseCode: string;
  fullName: string;
  subject: string;
  teacher: string; // Assuming this is the ID of the teacher
  timing: string;
  location: string;
}

const Dashboard = () => {
  const context = useContext(UserContext); // destructure user and setUser
  const user = context?.user;
  const courses = context?.usersCourses;
  const [selectedUser, setSelectedUser] = useState<UserIn | TeacherIn | null>(
    null
  );
  const [studentType, setStudentType] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedUser(user || null);
    if (localStorage.getItem("type") === "students") {
      setStudentType(true);
    }
  }, [user]);

  console.log(courses && "first course: " + courses[0]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function redirectToCourseSelection(_id: string): void {
    if (studentType) {
      navigate(`/student/${_id}`);
    } else {
      navigate(`/teacher/${_id}`);
    }
  }

  console.log(selectedUser);

  return (
    <>
      <Layout style={{ height: "100vh", margin: 0 }}>
        <Content
          style={{
            padding: "0 48px",
            overflow: "auto", // Prevents content overflow when zoomed
          }}
        >
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              padding: 24,
              borderRadius: borderRadiusLG,
              marginBottom: "24px", // Maintain spacing after the content box
              width: "100%", // Ensure the content width is responsive
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              {studentType ? (
                <h2>Student's profile:</h2>
              ) : (
                <h2>Teacher's profile:</h2>
              )}
            </div>
            {selectedUser && (
              <Card
                title={`${selectedUser.firstName} ${selectedUser.lastName}`}
                bordered={false}
                style={{
                  maxWidth: "100%", // Ensure it scales well with screen width
                  width: "100%",
                  margin: "0 auto",
                  padding: "24px",
                  borderRadius: "8px",
                  boxShadow:
                    "0 -4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)", // Added shadow to the top as well
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>ID:</strong> {selectedUser._id}
                    </p>
                    <p>
                      <strong>Date of birth:</strong> {selectedUser.dateOfBirth}
                    </p>
                    <p>
                      <strong>Gender:</strong> {selectedUser.gender}
                    </p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p>
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedUser.phoneNumber}
                    </p>
                    {!studentType && "department" in selectedUser && (
                      <p>
                        <strong>Department:</strong> {selectedUser.department}
                      </p>
                    )}
                  </Col>
                </Row>
              </Card>
            )}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              {studentType ? (
                <h2>Student's courses:</h2>
              ) : (
                <h2>Courses I teach:</h2>
              )}
              {courses && courses.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    justifyContent: "left",
                  }}
                >
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "16px",
                        maxWidth: "300px",
                        textAlign: "left",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <h3
                        style={{
                          marginBottom: "8px",
                          color: "#007acc",
                          cursor: "pointer",
                        }}
                        onClick={() => redirectToCourseSelection(course._id)} // TODO
                      >
                        {course.fullName}
                      </h3>
                      <p>
                        <strong>Code:</strong> {course.courseCode}
                      </p>
                      <p>
                        <strong>Subject:</strong> {course.subject}
                      </p>
                      {studentType && (
                        <p>
                          <strong>Teacher:</strong> {course.teacher}
                        </p>
                      )}

                      <p>
                        <strong>Timing:</strong> {course.timing}
                      </p>
                      <p>
                        <strong>Location:</strong> {course.location}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No courses enrolled yet.</p>
              )}
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </>
  );
};

export default Dashboard;
