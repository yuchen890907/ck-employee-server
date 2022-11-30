import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Authorization } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import authService from "../service/auth.service";

const PasswordPage = () => {
  const { loginState, setLoginState } = useStateContext();
  const navigate = useNavigate();
  const [password_origin, setPasswordOrigin] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  return (
    <Authorization>
      <Container style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "60%" }}>
          <Row>
            <Col>
              <Form>
                <Alert variant="danger" show={message.length > 0}>
                  {message}
                </Alert>

                <Form.Group className="mb-3">
                  <Form.Label column="lg">當前密碼</Form.Label>
                  <Form.Control
                    size="lg"
                    type="password"
                    placeholder="輸入您當前的密碼"
                    value={password_origin}
                    onInput={(e) => setPasswordOrigin(e.target.value)}
                  />
                </Form.Group>
                <br />
                <Form.Group className="mb-3">
                  <Form.Label column="lg">新密碼</Form.Label>
                  <Form.Control
                    size="lg"
                    type="password"
                    placeholder="輸入您的新密碼"
                    value={password}
                    onInput={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label column="lg">再次確認密碼</Form.Label>
                  <Form.Control
                    size="lg"
                    type="password"
                    placeholder="再次確認您的新密碼"
                    value={password_confirm}
                    onInput={(e) => setPasswordConfirm(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="d-flex justify-content-end">
              <Button
                size="lg"
                variant="success"
                type="submit"
                className="px-4"
                onClick={async () => {
                  if (password === password_confirm) {
                    if (password.length > 4)
                      authService
                        .changePassword(password_origin, password_confirm, loginState.token)
                        .then((res) => {
                          alert("密碼已更新，請重新登入!");
                          navigate("/logout");
                        })
                        .catch((err) => {
                          setMessage(err.response.data.message || err.response.data);
                        });
                    else {
                      setMessage("密碼長度需要5以上");
                    }
                  } else {
                    setMessage("兩次密碼不一致");
                  }
                }}
              >
                送出
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </Authorization>
  );
};

export default PasswordPage;
