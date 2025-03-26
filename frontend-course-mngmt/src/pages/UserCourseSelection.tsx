import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Breadcrumb, Col, Divider, Layout, Menu, Row, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";

import Card from "antd/es/card/Card";
import "./dashboard.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseIn } from "./Dashboard";
import StudentGrades from "../StudentGrades";
import useFetchAssignments from "../api/hooks/useFetchAssignments";
import MyGrades from "../MyGrades";

const UserCourseSelection = () => {
  const context = useContext(UserContext); // destructure user and setUser
  const navigate = useNavigate();
  const courses = context?.usersCourses;
  const { id: courseId } = useParams<{ id: string }>();
  const [course, setSelectedCourse] = useState<CourseIn | undefined>(undefined);
  const { assignments, grades, loading, error } = useFetchAssignments(
    courseId || "default-id"
  );

  useEffect(() => {
    const foundCourse = courses?.find((course) => course._id === courseId);

    console.log("the course id is: " + courseId);
    setSelectedCourse(foundCourse);
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
                  <p>
                    <strong>Teacher:</strong> {course?.teacher}
                  </p>
                  <p>
                    <strong>Timing:</strong> {course?.timing}
                  </p>
                </Col>
                <Col xs={24} sm={12}>
                  <p>
                    <strong>Location:</strong> {course?.location}
                  </p>
                </Col>
              </Row>
            </Card>
          </div>
          <MyGrades assignment={assignments} data={grades} />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </>
  );
};

export default UserCourseSelection;
