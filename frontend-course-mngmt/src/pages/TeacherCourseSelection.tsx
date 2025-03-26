import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Breadcrumb, Col, Divider, Layout, Menu, Row, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";

import Card from "antd/es/card/Card";
import "./dashboard.css";
import { data, useNavigate, useParams } from "react-router-dom";
import { CourseIn } from "./Dashboard";
import StudentGrades from "../StudentGrades";
import useFetchAssignments from "../api/hooks/useFetchAssignments";

const TeacherCourseSelection = () => {
  const context = useContext(UserContext); // destructure user and setUser
  const user = context?.user;
  const { id } = useParams<{ id: string }>();

  const { assignments, grades, loading, error } = useFetchAssignments(
    id || "default-id"
  );
  const navigate = useNavigate();
  const courses = context?.usersCourses;
  const { id: courseId } = useParams<{ id: string }>();
  const [course, setSelectedCourse] = useState<CourseIn | undefined>(undefined);

  useEffect(() => {
    const foundCourse = courses?.find((course) => course._id === courseId);

    setSelectedCourse(foundCourse);
    console.log(assignments);
  }, [courses]); // Add dependencies

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  console.log(course);

  const handleHomeClick = () => {
    navigate(-1); // Navigate to the home page
  };

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
            <Breadcrumb.Item>
              <span
                style={{ cursor: "pointer" }}
                onMouseEnter={(e: {
                  currentTarget: { style: { color: string } };
                }) => (e.currentTarget.style.color = "blue")}
                onMouseLeave={(e: {
                  currentTarget: { style: { color: string } };
                }) => (e.currentTarget.style.color = "#007acc")}
                onClick={handleHomeClick}
              >
                Home
              </span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{course?.courseCode}</Breadcrumb.Item>
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
              <h2>{course?.fullName}</h2>
            </div>
            <Card
              title={`${course?.fullName}`}
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
                    <strong>Course Code:</strong> {course?.courseCode}
                  </p>
                  <p>
                    <strong>Subject:</strong> {course?.subject}
                  </p>
                </Col>
                <Col xs={24} sm={12}>
                  <p>
                    <strong>Location:</strong> {course?.location}
                  </p>
                  <p>
                    <strong>Timing:</strong> {course?.timing}
                  </p>
                </Col>
              </Row>
            </Card>
          </div>
          <StudentGrades assignment={assignments} data={grades} />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </>
  );
};

export default TeacherCourseSelection;
