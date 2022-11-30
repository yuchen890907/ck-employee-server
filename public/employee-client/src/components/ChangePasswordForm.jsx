import React, { useState } from "react";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

export default function ChangePasswordForm(props) {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  return (
    <Container fluid>
      <Row className="col-md-10 mx-auto">
        <Col>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-5" controlId="oldpassword">
              <Form.Label column="lg">舊密碼</Form.Label>
              <Col sm="10">
                <Form.Control type="password" placeholder="Enter your old password" required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="newpassword">
              <Form.Label column="lg">新密碼</Form.Label>
              <Col sm="10">
                <Form.Control type="password" placeholder="Enter your new password" required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-4" controlId="renewpassword">
              <Form.Label column="lg">再次輸入新密碼</Form.Label>
              <Col sm="10">
                <Form.Control type="password" placeholder="Enter your new password again" required />
                <Form.Control.Feedback type="invalid">請再次輸入新密碼</Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Button size="mid" variant="success" type="check">
              修改密碼
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
