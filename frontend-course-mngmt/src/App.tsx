import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { UserContextProvider } from "./context/UserContext";
import Dashboard from "./pages/Dashboard";
import LoginTeachers from "./pages/LoginTeachers";
import LoginStudents from "./pages/LoginStudents";
import RefirectToMain from "./RefirectToMain";
import PrivateRoute from "./PrivateRoute";
import UserCourseSelection from "./pages/UserCourseSelection";
import TeacherCourseSelection from "./pages/TeacherCourseSelection";
import LoginAdmin from "./pages/LoginAdmin";
import Logout from "./components/Logout";
import AdminPanel from "./pages/AdminPanel";
import UserTeacherDash from "./pages/infosAdmin/UserTeacherDash";

function App() {
  return (
    <UserContextProvider>
      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/teacher/login"
          element={
            <RefirectToMain>
              <LoginTeachers />{" "}
            </RefirectToMain>
          }
        />
        <Route
          path="/student/login"
          element={
            <RefirectToMain>
              <LoginStudents />{" "}
            </RefirectToMain>
          }
        />
        <Route
          path="/admin/login"
          element={
            <RefirectToMain>
              <LoginAdmin />{" "}
            </RefirectToMain>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />{" "}
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-panel"
          element={
            <PrivateRoute>
              <AdminPanel />{" "}
            </PrivateRoute>
          }
        />

        <Route
          path="/student/:id"
          element={
            <PrivateRoute>
              <UserCourseSelection />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-dashboard/:type/:userId"
          element={<UserTeacherDash />}
        />

        <Route
          path="/teacher/:id"
          element={
            <PrivateRoute>
              <TeacherCourseSelection />
            </PrivateRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
