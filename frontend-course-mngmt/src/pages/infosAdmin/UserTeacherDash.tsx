import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Col,
  Layout,
  Row,
  Space,
  Table,
  Typography,
  theme,
} from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import Card from "antd/es/card/Card";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import BackButton from "../../components/BackButton";

const { Title } = Typography;

export interface UserIn {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  phoneNumber: string;
  courses: string[];
}

export interface TeacherIn extends UserIn {
  department: string;
}

export interface CourseIn {
  _id: string;
  courseCode: string;
  fullName: string;
  subject: string;
  teacher: string;
  timing: string;
  location: string;
}

interface DashboardProps {
  user: UserIn | TeacherIn;
  courses: CourseIn[];
  type: string;
}

const Dashboard = () => {
  const { type, userId } = useParams();
  const location = useLocation();
  const [courses, setCourses] = useState<CourseIn[]>([]);
  const user = location.state?.user;
  const [studentType, setStudentType] = useState(false);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get(`/admins/courses/${type}/${userId}`);
      if (type === "students") setStudentType(true);
      setCourses(res.data);
    };
    fetchCourses();
  }, [type, userId]);

  return (
    <Layout style={{ height: "100vh", margin: 0 }}>
      <Content style={{ padding: "0 48px", overflow: "auto" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item
            style={{
              cursor: "pointer",
              color: "#1890ff",
              textDecoration: "underline",
            }}
            onClick={() => navigate(-1)}
          >
            Admin Panel
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            {`${user.firstName} ${user.lastName}`}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
            marginBottom: "24px",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2>{studentType ? "Student's profile:" : "Teacher's profile:"}</h2>
          </div>

          {user && (
            <Card
              title={`${user.firstName} ${user.lastName}`}
              bordered={false}
              style={{
                maxWidth: "100%",
                width: "100%",
                margin: "0 auto",
                padding: "24px",
                borderRadius: "8px",
                boxShadow:
                  "0 -4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <p>
                    <strong>ID:</strong> {user._id}
                  </p>
                  <p>
                    <strong>Date of birth:</strong> {user.dateOfBirth}
                  </p>
                  <p>
                    <strong>Gender:</strong> {user.gender}
                  </p>
                </Col>
                <Col xs={24} sm={12}>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phoneNumber}
                  </p>
                  {!studentType && "department" in user && (
                    <p>
                      <strong>Department:</strong> {user.department}
                    </p>
                  )}
                </Col>
              </Row>
            </Card>
          )}

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2>
              {studentType ? "Student's courses:" : "Courses He/She teaches:"}
            </h2>

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
        <BackButton />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default Dashboard;
