// components/AddCourseForm.tsx
import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const AddCourseForm = ({ form }: { form: any }) => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/teachers/");
        console.log(response); // update with your actual API endpoint
        setTeachers(
          response.data.map((teacher: any) => ({
            label: teacher.firstName + " " + teacher.lastName,
            value: teacher._id,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);
  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        name="courseCode"
        label="Course Code"
        rules={[{ required: true, message: "Please enter the course code" }]}
      >
        <Input placeholder="e.g. CS101" />
      </Form.Item>

      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[{ required: true, message: "Please enter the full name" }]}
      >
        <Input placeholder="e.g. Introduction to Computer Science" />
      </Form.Item>

      <Form.Item
        name="subject"
        label="Subject"
        rules={[{ required: true, message: "Please enter the subject" }]}
      >
        <Input placeholder="e.g. Computer Science" />
      </Form.Item>

      {/* 🔽 New Courses Field */}
      <Form.Item
        name="teacherId"
        label="Teacher"
        rules={[{ required: true, message: "Please select a teacher" }]}
      >
        <Select
          placeholder="Select a course"
          options={teachers}
          loading={!teachers.length}
        />
      </Form.Item>

      <Form.Item
        name="timing"
        label="Timing"
        rules={[{ required: true, message: "Please enter timing" }]}
      >
        <Input placeholder="e.g. Mon, Tue 1PM-2:20PM" />
      </Form.Item>

      <Form.Item
        name="location"
        label="Location"
        rules={[{ required: true, message: "Please enter location" }]}
      >
        <Input placeholder="e.g. Room 101, Science Building" />
      </Form.Item>
    </Form>
  );
};

export default AddCourseForm;
