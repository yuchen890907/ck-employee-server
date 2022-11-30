import React, { useEffect, useState } from "react";
import { CardImg1, CardImg2, CardImg3, CardImg4 } from "../img/svg";
import { Authorization, MyCard } from "../components";
import { Container, Row } from "react-bootstrap";
import { useStateContext } from "../contexts/ContextProvider";
import fetchService from "../service/fetch.service";
const imgs = [CardImg1, CardImg2, CardImg3, CardImg4];

export default function EarningRecordPage() {
  const { APIState, loginState } = useStateContext();
  let now = new Date();
  now = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000).toISOString().split("T")[0];

  const tableName = "earningrecord";
  const [data, setData] = useState();
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (loginState.isLogin) {
      fetchService.token = loginState.token;
      APIState.fetchAll(`/${tableName}/date?start=${now}&end=${now}`)
        .then((res) => {
          if (res.data.success) setData(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  }, [loginState]);
  return (
    <Authorization>
      <Container>
        {(data && (
          <Row className="mt-4 justify-content-center">
            {data.cards.map((d, i) => (
              <MyCard key={`card-${i}`} title={d.title} value={d.value}>
                {imgs[i]()}
              </MyCard>
            ))}
          </Row>
        )) ||
          "您沒有查詢的權限"}
      </Container>
    </Authorization>
  );
}
