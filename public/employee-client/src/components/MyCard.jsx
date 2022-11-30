import React from "react";
import { Col, Card, Row } from "react-bootstrap";

export default function MyCard(props) {
  let { title, value, children } = props;
  return (
    <Col xl="3" md="6" className="mb-4">
      <Card className="card border-left-success shadow h-100 py-2">
        <Card.Body>
          <Row className="no-gutters align-items-center">
            <Col className="mr-2">
              <div className="text-xs font-weight-bold text-uppercase mb-1">{title}</div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">{value}</div>
            </Col>
            <Col>{children}</Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}
