import React from "react";
import { Container, Button, Form, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

export default function StoreForm(props) {
  const { id, title, state, setState } = props;

  const current = new Date();
  const datetime = `${current.getFullYear()}/${
    current.getMonth() + 1
  }/${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;

  return (
    <Container>
      <Row className="col mx-auto">
        <h1>{title}</h1>
        <Form>
          <Form.Label>表單填寫時間: {datetime}</Form.Label>
          <br />

          <Form.Label column="mid">檢查內容</Form.Label>
          {props.state.data.map((option) => (
            <Form.Check
              key={uuidv4()}
              type="switch"
              id="custom-switch"
              label={option.Content}
              className="mb-4"
            ></Form.Check>
          ))}
          <Button size="mid" variant="success" type="check">
            確定
          </Button>
        </Form>
      </Row>
    </Container>
  );
}
