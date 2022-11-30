import React, { useEffect } from "react";
import { useState } from "react";
import { Accordion, Alert, Card, Col, Container, Row } from "react-bootstrap";
import { Authorization } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import fetchService from "../service/fetch.service";

export default function OrdersPage() {
	const { dataState } = useStateContext();
	return (
		<Authorization>
			<Container className="orders-page">
				{dataState.orders?.length ? (
					<Row>
						{dataState.orders.map((order, index) => {
							return <Order order={order} index={index} key={`${order.saleInvoice}`} />;
						})}
					</Row>
				) : dataState.orders ? (
					"查無訂單資料"
				) : (
					"訂單載入中"
				)}
			</Container>
		</Authorization>
	);

	function Order({ order, index }) {
		const [orderDetails, setOrderDetails] = useState([]);
		const [message, setMessage] = useState("");
		const [show, setShow] = useState(false);

		const doneBtnHandler = async () => {
			try {
				setMessage("確認中");
				const res = await fetchService.updatePartialOne(`orders/status/${order.saleInvoice}`, { status: "已完成" });
			} catch (err) {
				setMessage(err.response.data.message);
			}
		};

		useEffect(() => {
			fetchService
				.findAll(`sales/saleInvoice/${order.saleInvoice}`)
				.then((res) => {
					if (res.data.success) setOrderDetails(res.data.data.data);
				})
				.catch((err) => setMessage(err.response.data.message));
		}, []);

		return (
			<Col className="mb-5" md={6} xl={4}>
				<Card className="p-2 py-4 order-card">
					<Card.Header>
						<div className="d-flex justify-content-between align-items-center">
							<Card.Title>訂單編號：{order.saleInvoice}</Card.Title>
							<i className="bi bi-check2-square order-card-btn" onClick={doneBtnHandler} />
						</div>
					</Card.Header>
					<Card.Body>
						<Alert show={message.length > 0}>{message}</Alert>
						<Card.Title>訂單資訊</Card.Title>
						<Card.Text className="m-0 mb-2">
							訂單成立時間：{order.saleDateTime} {order.orderTime}
						</Card.Text>
						<Card.Text className="m-0 mb-2">訂單總金額：{order.total}</Card.Text>
						<Card.Text className="m-0 mb-2">用餐人數：{order.count}</Card.Text>
						<Card.Text className="m-0 mb-2">內用/外帶：{order.forHere}</Card.Text>
						<Card.Text className="m-0">付款方式：{order.payment}</Card.Text>
					</Card.Body>
					<Card.Body className="py-2">
						<Card.Title style={{ cursor: "pointer" }} onClick={() => setShow((pre) => !pre)}>
							訂購人資訊 <i className={`bi bi-eye-${show ? "fill" : "slash-fill"}`} />
						</Card.Title>
						{show &&
							(order.order ? (
								<>
									<Card.Text className="m-0 mb-2">訂購者：{order.order.orderInfo.name}</Card.Text>
									<Card.Text className="m-0">連絡電話：{order.order.orderInfo.phoneNumber}</Card.Text>
								</>
							) : (
								<Card.Text>查無訂購人資料</Card.Text>
							))}
					</Card.Body>
					<Card.Body>
						<Card.Title>餐點明細</Card.Title>
						<div className="order-card-details">
							{orderDetails.map((detail) => {
								return <Detail detail={detail} key={`detail-${index}-${detail.itemNo}`} />;
							})}
						</div>
					</Card.Body>
				</Card>
			</Col>
		);

		function Detail({ detail }) {
			return (
				<Row>
					<Card.Subtitle className="m-0 mt-3 mb-1">
						{detail.productName} *{detail.quantity}
					</Card.Subtitle>
					{detail.remarks
						.split(",")
						.slice(0, -1)
						.map((item, i) => {
							return (
								<Card.Text className="m-0 mb-1 ms-2" key={`detail-${index}-${detail.itemNo}-${i}`}>
									- {item}
								</Card.Text>
							);
						})}
				</Row>
			);
		}
	}
}
