import React from "react";
import { Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";

export default function MyDatePicker() {
  return (
    <>
      <Container>
        <Row className="justify-content-around">
          <Col md="6">
            <InputGroup>
              <InputGroup.Text>起始日期</InputGroup.Text>
              <FormControl type="date" />
            </InputGroup>
          </Col>
          <Col md="6">
            <InputGroup>
              <InputGroup.Text>結束日期</InputGroup.Text>
              <FormControl type="date" />
            </InputGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
}
