import React from "react";
import { Container, Row, Col, Stack, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Authorization } from "../components";
import "../css/buttonStyle.css";

export default function EmployeeManagementPage() {
  return (
    <Authorization>
      <Container fluid>
        <Row>
          <Col>
            <Stack gap={5} className="col-md-8 mx-auto">
              <h1 className="mx-auto">員工管理</h1>
              <Button size="lg" variant="success" to="/punch" href="/punch" as={Link}>
                打卡
              </Button>
              <Button size="lg" variant="success" to="/schedules" href="/schedules" as={Link}>
                班表資訊
              </Button>
            </Stack>
          </Col>
        </Row>
      </Container>
    </Authorization>
  );
}
