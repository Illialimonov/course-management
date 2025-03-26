import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const context = useContext(UserContext);

  return (
    <nav>
      <Link to="/">Home </Link>
      {!context?.user ? (
        <>
          <Link to="/register">register </Link>
          <Link to="/login">login</Link>
        </>
      ) : (
        <Link to="/dashboard">DASHBOARD</Link>
      )}
    </nav>
  );
};

export default Navbar;
