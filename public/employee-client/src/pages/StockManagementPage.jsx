import React from "react";
import { Container, Row, Col, Stack, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Authorization } from "../components";
import "../css/buttonStyle.css";

export default function StockManagementPage() {
  return (
    <Authorization>
      <Container fluid>
        <Row>
          <Col>
            <Stack gap={5} className="col-md-8 mx-auto">
              <h1 className="mx-auto">庫存管理</h1>
              <Button size="lg" variant="success" to="/stockStatus" href="/stockStatus" as={Link}>
                庫存檢視
              </Button>
              <Button size="lg" variant="success" to="/purchase" href="/purchase" as={Link}>
                填寫進貨單
              </Button>
              <Button size="lg" variant="success" to="/purchaseRecord" href="/purchaseRecord" as={Link}>
                查詢進貨紀錄
              </Button>
              <Button size="lg" variant="success" to="/suppliers" href="/suppliers" as={Link}>
                查詢供應商資訊
              </Button>
            </Stack>
          </Col>
        </Row>
      </Container>
    </Authorization>
  );
}
