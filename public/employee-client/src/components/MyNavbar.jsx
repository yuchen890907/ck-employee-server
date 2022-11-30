import React from "react";
import logo from "../img/logo/CookAssistant_logo_transparent.svg";
import { Navbar, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
export default function MyNavbar() {
  const navigate = useNavigate();
  const { loginState } = useStateContext();

  return (
    <Navbar bg="light" className="myNavbar">
      <Container>
        <Navbar.Brand onClick={() => navigate(-1)} className="btn">
          <i className="bi bi-arrow-left fs-1" />
        </Navbar.Brand>
        <Navbar.Brand to="/" href="/" as={Link}>
          <img src={logo} alt="Logo" height="100" />
        </Navbar.Brand>
        {loginState.isLogin ? (
          <Link to="/logout" href="/logout" className="btn btn-outline-dark btn-lg">
            登出
          </Link>
        ) : (
          <Link to="/login" href="/login" className="btn btn-outline-dark btn-lg">
            登入
          </Link>
        )}
      </Container>
    </Navbar>
  );
}
