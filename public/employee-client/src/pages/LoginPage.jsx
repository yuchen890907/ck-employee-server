import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Form, Col, Button, Alert } from "react-bootstrap";
import authService from "../service/auth.service";
import { useStateContext } from "../contexts/ContextProvider";

export default function LoginPage() {
  const { loginState, setLoginState } = useStateContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await authService.login(account, password);
      if (res && res.data.success) {
        localStorage.setItem("login", JSON.stringify(res.data));
        setLoginState({
          isLogin: true,
          user: res.data.user,
          token: res.data.token,
        });
        return navigate(location.state || "/", { replace: true });
      }
      if (res.data.message) setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  //防止白癡登入後又想進login頁面(強迫回首頁)
  useEffect(() => {
    if (loginState.isLogin === true) navigate("/");
    // eslint-disable-next-line
  }, []);
  return (
    <Container style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "60%" }}>
        <Row>
          <Col>
            <Form>
              <Alert variant="danger" show={message.length > 0}>
                {message}
              </Alert>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label column="lg">使用者帳號</Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="Enter your Account"
                  value={account}
                  onInput={(e) => setAccount(e.target.value)}
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label column="lg">使用者密碼</Form.Label>
                <Form.Control
                  size="lg"
                  type="password"
                  placeholder="Enter your Password"
                  value={password}
                  onInput={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="d-flex justify-content-end">
            <Button size="lg" variant="success" type="submit" className="px-4" onClick={submitHandler}>
              登入
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
