// import React, { useContext, useEffect, useState } from "react";
// import { UserContext } from "../context/UserContext";
// import { Breadcrumb, Col, Divider, Layout, Menu, Row, theme } from "antd";
// import { Content, Footer, Header } from "antd/es/layout/layout";
// import useFetchUsers from "../api/hooks/useFetchUsers";
// import { StudentIn } from "../api/service/userService";
// import Card from "antd/es/card/Card";
// import "./dashboard.css";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const context = useContext(UserContext); // destructure user and setUser
//   const user = context?.user; // Safe to destructure after checking for null
//   const { users, loading, error } = useFetchUsers();
//   const [selectedUser, setSelectedUser] = useState<StudentIn | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (users.length > 0) {
//       setSelectedUser(users[0]); // Set the first user after the data has been loaded
//     }
//   }, [users]);

//   const items = users.map((_) => ({
//     key: _.id.toString(),
//     label: `${_.firstName}`,
//   }));

//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   const handleMenuClick = (e: { key: string }) => {
//     const user = users.find((user) => user.id.toString() === e.key);
//     if (user) {
//       setSelectedUser(user); // Set the found user
//     } else {
//       // Handle case where user is not found (e.g., reset or log error)
//       console.warn("User not found.");
//     } // Convert key to number and update state
//   };

//   const handleListClick = () => {
//     navigate("/class-selection");
//   };

//   return (
//     <>
//       <Layout style={{ height: "100vh", margin: 0 }}>
//         <Header style={{ display: "flex", alignItems: "center" }}>
//           <div className="demo-logo" />
//           <Menu
//             theme="dark"
//             mode="horizontal"
//             defaultSelectedKeys={["1"]}
//             items={items}
//             onClick={handleMenuClick}
//             style={{ flex: 1, minWidth: 0 }}
//           />
//         </Header>
//         <Content style={{ padding: "0 48px" }}>
//           <Breadcrumb style={{ margin: "16px 0" }}>
//             <Breadcrumb.Item>Home</Breadcrumb.Item>
//           </Breadcrumb>
//           <div
//             style={{
//               background: colorBgContainer,
//               minHeight: 280,
//               padding: 24,
//               borderRadius: borderRadiusLG,
//             }}
//           >
//             <div style={{ textAlign: "center" }}>
//               <h2>Selected Student's Full Info: </h2>
//             </div>
//             {selectedUser && (
//               <Card
//                 title={`${selectedUser.firstName} ${selectedUser.lastName}`}
//                 bordered={false}
//                 style={{ maxWidth: 800, margin: "0 auto" }}
//               >
//                 <Row gutter={16}>
//                   <Col xs={24} sm={12} md={12} lg={12} xl={12}>
//                     <p>
//                       <strong>ID:</strong> {selectedUser.id}
//                     </p>
//                     <p>
//                       <strong>Age:</strong> {selectedUser.age}
//                     </p>
//                     <p>
//                       <strong>Gender:</strong> {selectedUser.gender}
//                     </p>
//                     <p>
//                       <strong>Email:</strong> {selectedUser.email}
//                     </p>
//                     <p>
//                       <strong>Phone:</strong> {selectedUser.phone}
//                     </p>
//                   </Col>
//                   <Col xs={24} sm={12} md={12} lg={12} xl={12}>
//                     <p>
//                       <strong>Username:</strong> {selectedUser.username}
//                     </p>
//                     <p>
//                       <strong>Birth Date:</strong> {selectedUser.birthDate}
//                     </p>
//                     <p>
//                       <strong>Role:</strong> {selectedUser.role}
//                     </p>
//                   </Col>
//                 </Row>
//                 <Divider />
//               </Card>
//             )}
//           </div>
//         </Content>
//         <Footer style={{ textAlign: "center" }}>
//           Ant Design ©{new Date().getFullYear()} Created by Ant UED
//         </Footer>
//       </Layout>
//     </>
//   );
// };

// export default Dashboard;
