import React, { useEffect, useState } from "react";
import { Container, Button, Row, Col, Form, InputGroup, Modal, Card, FloatingLabel, Alert } from "react-bootstrap";
import { useStateContext } from "../contexts/ContextProvider";
import { Authorization } from "../components";
import { useNavigate } from "react-router-dom";

export default function PurchasePage() {
	const { dataState, APIState } = useStateContext();
	const tableName = "purchases";
	const emptyDetail = { genericgoodNo: "", quantity: 0, unit: "", unitPrice: 0 };
	const [details, setDetails] = useState([emptyDetail]);
	const [message, setMessage] = useState("");
	const [purchaseInvoice, setPurchaseInvoice] = useState("");
	const [purchaseDateTime, setPurchaseDateTime] = useState("");
	const [sPhone, setsPhone] = useState("");
	const [total, setTotal] = useState(0);
	const navigate = useNavigate();
	useEffect(() => {
		setTotal(() => {
			let sum = 0;
			details.forEach((detail) => (sum += detail.quantity * detail.unitPrice));
			return sum;
		});
	}, [details]);
	return (
		<Authorization>
			<Container className="purchase-page">
				{dataState?.suppliers && (
					<Card className="p-5">
						<Card.Header style={{ backgroundColor: "#ffff" }}>
							<Card.Title>進貨表單填寫</Card.Title>
						</Card.Header>
						<Card.Body className="py-0">
							<Alert show={message?.length > 0} variant="info" className="mt-2">
								{message}
							</Alert>
							<FloatingLabel label="進貨編號" className="my-3">
								<Form.Control
									type="text"
									placeholder="進貨編號"
									value={purchaseInvoice}
									onChange={(e) => setPurchaseInvoice(e.target.value)}
								/>
							</FloatingLabel>
							<FloatingLabel label="進貨時間" className="my-3">
								<Form.Control
									type="datetime-local"
									placeholder="進貨時間"
									value={purchaseDateTime}
									onChange={(e) => {
										setPurchaseDateTime(e.target.value);
									}}
								/>
							</FloatingLabel>
							<FloatingLabel className="my-3" label="供應商">
								<Form.Select value={sPhone} onChange={(e) => setsPhone(e.target.value)}>
									<option disabled value="">
										請選擇供應商
									</option>
									{dataState.suppliers.data.map((record, i) => (
										<option key={`select-${i}`} value={record.phone}>
											{record.headName} ({record.phone})
										</option>
									))}
								</Form.Select>
							</FloatingLabel>
						</Card.Body>
						<Card.Body className="purchase-details">
							<Card.Title className="pb-2"> 進貨明細</Card.Title>
							{details.map((detail, i) => (
								<div key={`details-${i}`} className="target-container">
									<div className="drag-source d-flex mb-5 my-sm-2">
										<Row style={{ flex: "1" }} className="pe-sm-3 pe-3">
											<Col sm="4" className="my-1">
												<FloatingLabel label="原物料">
													<Form.Select
														value={detail.genericgoodNo}
														onChange={(e) => {
															setDetails((pre) => {
																let o = JSON.parse(JSON.stringify(pre[i]));
																o.genericgoodNo = e.target.value;
																o.unit = dataState.genericgoods.data.find(
																	(record) => e.target.value === record.genericgoodNo
																).unit;
																o.quantity = 0;
																o.unitPrice = 0;
																return [...pre.slice(0, i), o, ...pre.slice(i + 1)];
															});
															setMessage("");
														}}>
														<option disabled value="">
															請選擇原物料
														</option>
														{dataState?.genericgoods?.data.map((record, j) => (
															<option key={`select-${i}-${j}`} value={record.genericgoodNo}>
																{record.genericgoodName}
															</option>
														))}
													</Form.Select>
												</FloatingLabel>
											</Col>
											<Col sm="4" className="my-1">
												<FloatingLabel label={`數量${detail.unit ? `(${detail.unit})` : ""}`}>
													<Form.Control
														type="number"
														min="0"
														placeholder="數量"
														value={detail.quantity}
														onChange={(e) => {
															if (details[i].genericgoodNo)
																setDetails((pre) => {
																	let o = JSON.parse(JSON.stringify(pre[i]));
																	o.quantity = e.target.value;
																	return [...pre.slice(0, i), o, ...pre.slice(i + 1)];
																});
															else setMessage("請先選擇原物料");
														}}
													/>
												</FloatingLabel>
											</Col>
											<Col sm="4" className="my-1">
												<FloatingLabel label="單價">
													<Form.Control
														type="number"
														placeholder="單價"
														min="0"
														value={detail.unitPrice}
														onChange={(e) => {
															if (details[i].genericgoodNo)
																setDetails((pre) => {
																	let o = JSON.parse(JSON.stringify(pre[i]));
																	o.unitPrice = e.target.value;
																	return [...pre.slice(0, i), o, ...pre.slice(i + 1)];
																});
															else setMessage("請先選擇原物料");
														}}
													/>
												</FloatingLabel>
											</Col>
										</Row>
										<Button
											className="d-flex align-items-center justify-content-center my-1"
											variant="outline-secondary"
											onClick={() => setDetails((pre) => [...pre.slice(0, i), ...pre.slice(i + 1)])}
											style={{ flex: "0 1 35px" }}>
											<i className="bi bi-trash3-fill"></i>
										</Button>
									</div>
								</div>
							))}
							<Button
								className="d-flex align-items-center my-2 p-0 ps-2 pe-3"
								variant="outline-secondary"
								style={{ fontWeight: "600" }}
								onClick={() => setDetails((pre) => [...pre, JSON.parse(JSON.stringify(emptyDetail))])}>
								<i className="bi bi-plus" style={{ fontSize: "1.5rem", fontWeight: "700" }}></i>新增明細
							</Button>
						</Card.Body>
						<Card.Footer style={{ backgroundColor: "#ffff" }} className="d-flex align-items-end flex-column">
							<Card.Title className="py-3">總金額: {total} 元</Card.Title>
							<Button
								className="px-4"
								onClick={() => {
									const data = {
										purchaseInvoice,
										purchaseDateTime,
										total,
										sPhone,
										details,
									};
									APIState.insertOne(tableName, data).then((msg) => {
										if (msg) setMessage(msg);
										else {
											alert("新增成功");
											navigate("/purchaseRecord");
										}
									});
								}}>
								送出
							</Button>
						</Card.Footer>
					</Card>
				)}
			</Container>
		</Authorization>
	);
}
