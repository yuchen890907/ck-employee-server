import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { useGeolocated } from "react-geolocated";
import GoogleMapReact from "google-map-react";
import Authorization from "../components/Authorization";
import { useStateContext } from "../contexts/ContextProvider";

export default function PunchPage() {
  const { loginState, APIState } = useStateContext();
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });
  const API_KEY = "AIzaSyACPWfUqNjA4WtZeyoMM207-M4-6Qe_ka4";
  const Marker = ({ text }) => <i className="bi bi-geo-alt-fill" style={{ color: "#f0f", fontSize: "1.5rem" }} />;
  const [datetime, setDatetime] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    APIState.fetchAll("/punchrecords/status/" + loginState.user?.account)
      .then((res) => {
        if (res.data.success) setStatus(res.data.data.status);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    setInterval(() => {
      let tzoffset = new Date().getTimezoneOffset() * 60000;
      let now = new Date(new Date() - tzoffset).toISOString().slice(0, 19).replace("T", "status");
      setDatetime(now);
    }, 1000);
  }, []);
  return (
    <Authorization>
      <Container className="punch-page">
        {!isGeolocationAvailable ? (
          <div> 您的裝置或瀏覽器不支援定位</div>
        ) : !isGeolocationEnabled ? (
          <div>請開啟的的定位</div>
        ) : coords ? (
          <div>
            <Row
              className={`py-2 d-flex align-items-center justify-content-center ${status === "下班" ? "green" : "red"}`}
            >
              <Alert variant="danger" show={message.length > 0}>
                {message}
              </Alert>
              <div className="clock">
                <span>{datetime.slice(-8)}</span>
                <p>{datetime.slice(0, 10)}</p>
              </div>
              <div className="d-flex justify-content-center pt-4 name">{loginState.user.name}</div>
              <div className="d-flex justify-content-center pt-1 pb-3 status">
                目前狀態: <span>{status}</span>
              </div>
              <div className="w-100 d-flex justify-content-center pb-5">
                <div
                  className="clock-btn"
                  onClick={() => {
                    APIState.insertOne("punchrecords/punch", {
                      GPS: `https://maps.googleapis.com/maps/api/staticmap?center=${coords.latitude},${coords.longitude}&zoom=17&size=400x350&markers=color:0xff00ff%7Clabel:N%7C${coords.latitude},${coords.longitude}&key=${API_KEY}`,
                    })
                      .then((response) => {
                        if (response) {
                          setMessage(response);
                        } else {
                          setStatus((pre) => (pre === "上班" ? "下班" : "上班"));
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                >
                  打卡
                </div>
              </div>
            </Row>
            <Row className="py-4" style={{ height: "40vh" }}>
              GPS位置 : {`${coords.latitude}, ${coords.longitude}`}
              <GoogleMapReact
                bootstrapURLKeys={{ key: API_KEY }}
                defaultCenter={{ lat: coords.latitude, lng: coords.longitude }}
                defaultZoom={17}
                yesIWantToUseGoogleMapApiInternals
              >
                <Marker lat={coords.latitude} lng={coords.longitude} />
              </GoogleMapReact>
            </Row>
          </div>
        ) : (
          <div>載入中...</div>
        )}
      </Container>
    </Authorization>
  );
}
