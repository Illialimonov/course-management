// components/AddTeacherForm.tsx
import { Form, Input, Select, DatePicker } from "antd";

const { Option } = Select;

const AddTeacherForm = ({ form }: { form: any }) => {
  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[{ required: true, message: "Please enter the first name" }]}
      >
        <Input placeholder="e.g. Michael" />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[{ required: true, message: "Please enter the last name" }]}
      >
        <Input placeholder="e.g. Davis" />
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
        <Input placeholder="e.g. firstTeacher@gmail.com" />
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
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please enter a password" }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Phone Number"
        rules={[{ required: true, message: "Please enter the phone number" }]}
      >
        <Input placeholder="e.g. +1314151617" />
      </Form.Item>

      <Form.Item
        name="department"
        label="Department"
        rules={[{ required: true, message: "Please enter the department" }]}
      >
        <Input placeholder="e.g. Biology" />
      </Form.Item>
    </Form>
  );
};

export default AddTeacherForm;
