import React from "react";
import { Container, Row } from "react-bootstrap";
import MyCard from "./MyCard";
import { v4 as uuidv4 } from "uuid";

export default function MyCardGroup(props) {
  let { data } = props;
  return (
    <Container>
      <h1>當日營收</h1>
      <Row xs={1} md={2} className="g-4 justify-content-center">
        {data.map((d) => {
          return (
            <MyCard key={uuidv4()} title={d.title} value={d.value}>
              {d.img()}
            </MyCard>
          );
        })}
      </Row>
    </Container>
  );
}
