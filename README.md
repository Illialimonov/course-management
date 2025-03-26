# 📚 Course Management System

A full-stack web application for managing university-level courses, assignments, and grades. Built using modern technologies like **React + TypeScript**, **Zustand**, **Node.js + Express**, and **MongoDB** as my primary database, this app allows users to log in as **Students**, **Teachers**, or **Admins** with role-based access and functionality.

---

## 🚀 Tech Stack

### Frontend
- **React** (with **TypeScript** + **JavaScript** mix)
- **Zustand** for state management
- **Axios** for API requests

### Backend
- **Node.js** with **Express.js**
- **MongoDB** as the database
- **JWT** for authentication & role-based access

---

## 🔐 Authentication

- Users authenticate using **JWT tokens**
- Role-based access control: `Student`, `Teacher`, `Admin`

---

## 👥 User Roles & Features

### 🧑‍🎓 Student
- Login and view personal information
- See a list of enrolled courses
- Click on a course to view:
  - Course information (meeting hours, room, etc.)
  - Assignment grades for that course

### 👩‍🏫 Teacher
- Login to view all the courses they are teaching
- Click on a course to:
  - Create assignments
  - Assign grades to students
  - Use an "Edit Mode" to update course content

### 🛠️ Admin
- Full CRUD capabilities on:
  - Courses
  - Students
  - Teachers

---


## 📸 Screenshots

Below are some screenshots demonstrating the functionality of the Course Management System.


### 🔐 Login Page

<img width="1023" alt="Screenshot 2025-03-26 at 4 39 00 PM" src="https://github.com/user-attachments/assets/ca8e5b72-6dd6-4d3a-8686-8f96bb32afcb" />


### 🧑‍🎓 Student Dashboard
- View enrolled courses as well as student information
  <img width="1433" alt="Screenshot 2025-03-26 at 4 55 15 PM" src="https://github.com/user-attachments/assets/59fba411-04d2-4283-ab57-303e92b1df35" />

- See grades and course info
  
<img width="1023" alt="Screenshot 2025-03-26 at 5 12 30 PM" src="https://github.com/user-attachments/assets/ffa6614f-936d-4b98-8ac3-443d41482251" />


### 👩‍🏫 Teacher Dashboard
- View teacher information as well as courses tought
  <img width="1020" alt="Screenshot 2025-03-26 at 5 22 31 PM" src="https://github.com/user-attachments/assets/fcb5eddb-b3de-4049-8d1c-dfa436aeac13" />

- Create assignments and Enter edit mode to modify grades for each assignment
<img width="1023" alt="Screenshot 2025-03-26 at 5 06 00 PM" src="https://github.com/user-attachments/assets/5c88bf25-04c1-4ca4-9aad-ef9e02aede46" />

- Edit any grades as well as delete any assignment if necessery
<img width="1023" alt="Screenshot 2025-03-26 at 5 09 41 PM" src="https://github.com/user-attachments/assets/9ec65fe9-aeef-44de-9741-b64ee504e1f4" />

- All the changes are automatically persisted to the database
<img width="1012" alt="Screenshot 2025-03-26 at 5 10 09 PM" src="https://github.com/user-attachments/assets/0351ae66-1b05-4b0b-99e8-f8b3f89dfa43" />


### 🛠️ Admin Panel
- CRUD operations for students, teachers, and courses
![Admin Panel](./screenshots/admin-panel.png)

---




