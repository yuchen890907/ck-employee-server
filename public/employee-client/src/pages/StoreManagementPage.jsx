import React from "react";
import { Container, Row, Col, Stack, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Authorization } from "../components";

export default function StoreManagementPage() {
  return (
    <Authorization>
      <Container fluid>
        <Row>
          <Col>
            <Stack gap={5} className="col-md-8 mx-auto">
              <h1 className="mx-auto">店面管理</h1>
              <Button size="lg" variant="success" to="/SOPForm" href="/SOPForm" as={Link}>
                填寫開/閉店表單
              </Button>
              <Button size="lg" variant="success" to="/SOPRecord" href="/SOPRecord" as={Link}>
                查詢開/閉店表單紀錄
              </Button>
            </Stack>
          </Col>
        </Row>
      </Container>
    </Authorization>
  );
}
