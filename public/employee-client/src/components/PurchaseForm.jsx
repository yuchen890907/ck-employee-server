import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Container, Button, Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import DateTime from "react-datetime";

export default function PurchaseForm(props) {
  const [lgShow, setLgShow] = useState(false);

  return (
    <Container fluid>
      <Row className="col-md-10 mx-auto">
        <Col>
          <h1>進貨表單填寫</h1>
          <Form>
            <Form.Label column="mid">進貨編號</Form.Label>
            <InputGroup className="mb-4" controlid="PurchaseInvoice">
              <Form.Control size="mid" type="text"></Form.Control>
            </InputGroup>
            <Form.Label column="mid">進貨時間</Form.Label>
            <DateTime id="DateTime" dateFormat="YYYY-MM-DD" timeFormat=" hh:mm A" className="mb-3"></DateTime>
            <Form.Label column="mid">進貨金額</Form.Label>
            <InputGroup className="mb-4" controlid="Total">
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control size="mid" type="cost"></Form.Control>
            </InputGroup>
            <Form.Label column="mid">員工帳號</Form.Label>
            <InputGroup className="mb-4" controlid="eAccount">
              <Form.Control disabled size="mid" type="text"></Form.Control>
            </InputGroup>
            <Form.Group className="mb-3" controlid="Phone">
              <Form.Label column="mid">供應商電話</Form.Label>
              <Form.Select className="mb-3" contorlid="Username">
                {props.state.sPhone.map((option) => (
                  <option key={uuidv4()} value={option.value}>
                    {option.label}---{option.phone}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlid="Phone">
              <Form.Label column="mid">填寫明細資訊</Form.Label>
              <br />
              <Button onClick={() => setLgShow(true)}>填寫明細資訊</Button>
              <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>明細資訊</Modal.Title>
                </Modal.Header>
                <Modal.Body></Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setLgShow(false)}>
                    取消
                  </Button>
                  <Button variant="primary" onClick={() => setLgShow(false)}>
                    儲存
                  </Button>
                </Modal.Footer>
              </Modal>
            </Form.Group>
            <Button size="mid" variant="success" type="check">
              確定
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
