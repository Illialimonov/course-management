// components/AddStudentForm.tsx
import { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker } from "antd";
import axios from "../api/axios";

const AddStudentForm = ({ form }: { form: any }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/courses/");
        console.log(response); // update with your actual API endpoint
        setCourses(
          response.data.map((course: any) => ({
            label: course.fullName,
            value: course._id,
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
        name="firstName"
        label="First Name"
        rules={[{ required: true, message: "Please enter the first name" }]}
      >
        <Input placeholder="e.g. Roman" />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[{ required: true, message: "Please enter the last name" }]}
      >
        <Input placeholder="e.g. Jones" />
      </Form.Item>

      <Form.Item
        name="dateOfBirth"
        label="Date of Birth"
        rules={[{ required: true, message: "Please select the date of birth" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please enter a valid email" },
          { type: "email", message: "Invalid email format" },
        ]}
      >
        <Input placeholder="e.g. firstStudent@gmail.com" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please enter a password" }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: "Please select a gender" }]}
      >
        <Select
          placeholder="Select gender"
          options={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
            { label: "Other", value: "Other" },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Phone Number"
        rules={[{ required: true, message: "Please enter the phone number" }]}
      >
        <Input placeholder="e.g. +1314151617" />
      </Form.Item>

      {/* 🔽 New Courses Field */}
      <Form.Item
        name="coursesIds"
        label="Courses"
        rules={[{ required: true, message: "Please select a course" }]}
      >
        <Select
          mode="multiple"
          placeholder="Select a course"
          options={courses}
          loading={!courses.length}
        />
      </Form.Item>
    </Form>
  );
};

export default AddStudentForm;
