import React, { useContext, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons"; // Make sure this is imported
import { DeleteOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Form,
  Layout,
  Menu,
  message,
  Row,
  Space,
  Spin,
  Table,
  theme,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import useFetchUsers from "../api/hooks/useFetchUsers";
import { StudentIn } from "../api/service/userService";
import Card from "antd/es/card/Card";
import "./dashboard.css";
import Title from "antd/es/skeleton/Title";
import { CourseIn, TeacherIn } from "./Dashboard";
import axios from "../api/axios";
import "antd/dist/reset.css"; // or 'antd/dist/antd.css'
import { Modal } from "antd";

import UserTeacherDash from "./infosAdmin/UserTeacherDash";
import { useNavigate } from "react-router-dom";
import AddCourseForm from "../forms/AddCourseForm";
import AddTeacherForm from "../forms/AddTeacherForm";
import AddStudentForm from "../forms/AddStudentForm";

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<CourseIn[]>([]);
  const [teachers, setTeachers] = useState<TeacherIn[]>([]);
  const [students, setStudents] = useState<StudentIn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const [specificCourses, setSpecificCourses] = useState<CourseIn[]>([]);

  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
  const [isTeacherModalVisible, setIsTeacherModalVisible] = useState(false);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<
    CourseIn | TeacherIn | StudentIn | null
  >(null);

  const [courseForm] = Form.useForm();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, teachersRes, studentsRes] = await Promise.all([
          axios.get("/admins/all-courses"),
          axios.get("/admins/all-teachers"),
          axios.get("/admins/all-students"),
        ]);

        setCourses(coursesRes.data);
        setTeachers(teachersRes.data);
        setStudents(studentsRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spin fullscreen />;

  async function handleRowClick(record: any, type: string) {
    navigate(`/user-dashboard/${type}/${record._id}`, {
      state: {
        user: record, // pass the full object if needed
      },
    });
  }

  const showisCourseModalVisible = () => {
    setIsCourseModalVisible(true);
  };
  const showisTeacherModalVisible = () => {
    setIsTeacherModalVisible(true);
  };
  const showisStudentModalVisible = () => {
    setIsStudentModalVisible(true);
  };

  const openDeleteModal = (course: CourseIn | TeacherIn | StudentIn) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  function isCourseIn(obj: any): obj is CourseIn {
    return "courseCode" in obj && "fullName" in obj;
  }

  function isTeacherIn(obj: any): obj is TeacherIn {
    return (
      "firstName" in obj &&
      "lastName" in obj &&
      "email" in obj &&
      !("courses" in obj)
    ); // adjust as needed
  }

  function isStudentIn(obj: any): obj is StudentIn {
    return (
      "firstName" in obj &&
      "lastName" in obj &&
      "email" in obj &&
      "courses" in obj
    ); // assuming students have courses
  }

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;

    let type;

    if (isCourseIn(courseToDelete)) {
      type = "courses";
    } else if (isStudentIn(courseToDelete)) {
      type = "users";
    } else if (isTeacherIn(courseToDelete)) {
      type = "teachers";
    }

    console.log(`/` + type + `/${courseToDelete._id}`);

    try {
      await axios.delete(`/` + type + `/${courseToDelete._id}`);
      message.success("Course deleted successfully");

      setCourses((prev) =>
        prev.filter((course) => course._id !== courseToDelete._id)
      );
    } catch (error) {
      console.error("Delete failed", error);
      message.error("Failed to delete course");
    } finally {
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
      navigate(0);
    }
  };

  return (
    <>
      {/* Inline CSS for hover effect */}
      <style>
        {`
    .ant-table-tbody > tr.hover-row:hover > td {
      background-color: #e6f4ff !important;
      transition: background-color 0.2s ease-in-out;
      cursor: pointer;
    }
  `}
      </style>
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", padding: 24 }}
      >
        <Title level={2}>Admin Dashboard</Title>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Courses</span>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showisCourseModalVisible} // your actual handler
                    size="small"
                  >
                    Add
                  </Button>
                </div>
              }
            >
              <Table
                dataSource={courses}
                rowKey="_id"
                columns={[
                  { title: "Code", dataIndex: "courseCode", key: "courseCode" },
                  { title: "Name", dataIndex: "fullName", key: "fullName" },
                  { title: "Teacher", dataIndex: "teacher", key: "teacher" },
                  {
                    title: "Action",
                    key: "action",
                    render: (_: any, record: CourseIn) => (
                      <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={(e: { stopPropagation: () => void }) => {
                          e.stopPropagation();
                          openDeleteModal(record);
                        }}
                      />
                    ),
                  },
                ]}
                pagination={{ pageSize: 5 }}
                rowClassName={() => "hover-row"}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Teachers</span>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showisTeacherModalVisible} // TODO: Replace with your actual handler
                    size="small"
                  >
                    Add
                  </Button>
                </div>
              }
            >
              <Table
                dataSource={teachers}
                rowKey="_id"
                columns={[
                  {
                    title: "First Name",
                    dataIndex: "firstName",
                    key: "firstName",
                  },
                  {
                    title: "Last Name",
                    dataIndex: "lastName",
                    key: "lastName",
                  },
                  { title: "Email", dataIndex: "email", key: "email" },
                  {
                    title: "Action",
                    key: "action",
                    render: (_: any, record: TeacherIn) => (
                      <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={(e: { stopPropagation: () => void }) => {
                          e.stopPropagation();
                          openDeleteModal(record);
                        }}
                      />
                    ),
                  },
                ]}
                pagination={{ pageSize: 5 }}
                onRow={(record: any) => ({
                  onClick: () => handleRowClick(record, "teachers"),
                })}
                rowClassName={() => "hover-row"}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Students</span>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showisStudentModalVisible} // your actual handler
                    size="small"
                  >
                    Add
                  </Button>
                </div>
              }
            >
              <Table
                dataSource={students}
                rowKey="_id"
                columns={[
                  {
                    title: "First Name",
                    dataIndex: "firstName",
                    key: "firstName",
                  },
                  {
                    title: "Last Name",
                    dataIndex: "lastName",
                    key: "lastName",
                  },
                  { title: "Email", dataIndex: "email", key: "email" },
                  {
                    title: "Action",
                    key: "action",
                    render: (_: any, record: CourseIn) => (
                      <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={(e: { stopPropagation: () => void }) => {
                          e.stopPropagation();
                          openDeleteModal(record);
                        }}
                      />
                    ),
                  },
                ]}
                pagination={{ pageSize: 5 }}
                onRow={(record: any) => ({
                  onClick: () => handleRowClick(record, "students"),
                })}
                rowClassName={() => "hover-row"}
              />
            </Card>
          </Col>
        </Row>
      </Space>
      <Modal
        title="Add New Course"
        open={isCourseModalVisible}
        onCancel={() => {
          setIsCourseModalVisible(false);
          courseForm.resetFields();
        }}
        onOk={async () => {
          try {
            const values = await courseForm.validateFields();
            console.log("Submitted values:", values);
            console.log("Fields before validate:", form.getFieldsValue());

            const response = await axios.post("/courses/", values);
            console.log("Server response:", response.data);

            setIsCourseModalVisible(false);
            courseForm.resetFields();
            message.success("Course added successfully");
            navigate(0);
          } catch (err: any) {
            console.error("Submission failed:", err);

            if (err.response && err.response.data?.error) {
              message.error(`Error: ${err.response.data.error}`);
            } else {
              message.error("Something went wrong while submitting the form.");
            }
          }
        }}
        okText="Create"
      >
        <AddCourseForm form={courseForm} />
      </Modal>
      <Modal
        title="Add New Teacher"
        open={isTeacherModalVisible}
        onCancel={() => {
          setIsTeacherModalVisible(false);
          form.resetFields();
        }}
        onOk={async () => {
          try {
            const values = await form.validateFields();
            console.log("Submitted values:", values);

            const response = await axios.post("/teachers/", values);
            console.log("Server response:", response.data);
            navigate(0);

            setIsTeacherModalVisible(false);
            form.resetFields();
          } catch (err) {
            console.log("Validation failed:", err);
          }
        }}
        okText="Create"
      >
        <AddTeacherForm form={form} />
      </Modal>
      <Modal
        title="Add New Student"
        open={isStudentModalVisible}
        onCancel={() => {
          setIsStudentModalVisible(false);
          form.resetFields();
        }}
        onOk={async () => {
          try {
            const values = await form.validateFields();
            console.log("Submitted values:", values);

            const response = await axios.post("/users/", values);
            console.log("Server response:", response.data);

            setIsStudentModalVisible(false);
            form.resetFields();
            navigate(0);

            // TODO: axios.post(...) to your API
          } catch (err) {
            console.log("Validation failed:", err);
          }
        }}
        okText="Create"
      >
        <AddStudentForm form={form} />
      </Modal>
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        Are you sure you want to delete <strong>{courseToDelete?._id}</strong>?
      </Modal>
    </>
  );
};

export default AdminDashboard;
