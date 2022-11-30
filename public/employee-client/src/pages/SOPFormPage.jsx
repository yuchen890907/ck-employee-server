import React, { useState } from "react";
import { useEffect } from "react";
import { Container, Button, Form, Row, Tabs, Tab, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Authorization } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

export default function SOPFormPage() {
  const { dataState } = useStateContext();
  const tableName = "sopform";
  const types = ["開店", "閉店"];
  return (
    <Authorization>
      <Container className="shadow p-5 SOPForm-page">
        {dataState && dataState[tableName] && (
          <Tabs defaultActiveKey={types[0]} transition={false} className="mb-3">
            {types.map((type, index) => {
              return (
                <Tab key={type} eventKey={type} title={type + "表單"}>
                  <SOPForm type={type} />
                </Tab>
              );
            })}
          </Tabs>
        )}
      </Container>
    </Authorization>
  );
}
function SOPForm({ type }) {
  const { dataState, APIState } = useStateContext();
  const tableName = "sopform";
  const current = new Date();
  const navigate = useNavigate();
  // const datetime = `${current.getFullYear()}/${
  // 	current.getMonth() + 1
  // }/${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
  const [datetime, setDatetime] = useState();
  const [message, setMessage] = useState("");
  const [checkItems, setCheckItems] = useState(
    dataState[tableName].data
      .filter((record) => record.sopClass === type)
      .map((record) => {
        return { ...record, done: false };
      })
  );
  useEffect(() => {
    setInterval(() => {
      let tzoffset = new Date().getTimezoneOffset() * 60000;
      let now = new Date(new Date() - tzoffset).toISOString().slice(0, 19).replace("T", " ");
      setDatetime(now);
    }, 1000);
  }, []);
  return (
    <Container>
      <Row className="col mx-auto">
        <div className="py-2 d-flex align-items-center">
          <i className="bi bi-clock mx-1"></i>
          {datetime}
        </div>
        <Alert show={message.length > 0} variant="danger">
          {message}
        </Alert>
        <ul className="list">
          {checkItems.map((record, i) => (
            <li
              key={`switch-${i}`}
              className={record.done ? "done" : ""}
              onClick={() => {
                setCheckItems((pre) => {
                  const o = [...pre];
                  o[i].done = !o[i].done;
                  return o;
                });
              }}
            >
              {record.content}
            </li>
          ))}
        </ul>
        <Button
          size="mid"
          variant="success"
          onClick={async () => {
            if (checkItems.findIndex((record) => record.done === false) > -1) setMessage("你未完成所有事項，請在確認後再試。");
            else {
              APIState.insertOne("soprecords", {
                data: checkItems.map((record) => {
                  return { sopClass: record.sopClass, content: record.content };
                }),
              })
                .then((res) => {
                  if (res) setMessage("你未完成所有事項，請在確認後再試。");
                  else {
                    alert("成功");
                    navigate("/SOPRecord");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }}
        >
          確定
        </Button>
      </Row>
    </Container>
  );
}
