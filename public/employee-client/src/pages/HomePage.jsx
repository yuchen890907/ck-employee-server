import React from "react";
import { Container, Row, Col, Stack, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/buttonStyle.css";

export default function HomePage() {
	return (
		<Container>
			<Row>
				<Col sm="6" className="col-12 d-flex justify-content-center px-5 my-3">
					<Button className="w-100" size="lg" variant="success" to="/orders" href="/orders" as={Link}>
						即時訂單資訊
					</Button>
				</Col>
				<Col sm="6" className="col-12 d-flex justify-content-center px-5 my-3">
					<Button className="w-100" size="lg" variant="success" to="/sales" href="/sales" as={Link}>
						查詢訂單紀錄
					</Button>
				</Col>
				<Col sm="6" className="col-12 d-flex justify-content-center px-5 my-3">
					<Button
						className="w-100"
						size="lg"
						variant="success"
						to="/earningRecord"
						href="/earningRecord"
						as={Link}>
						當日營收檢視
					</Button>
				</Col>
				<Col sm="6" className="col-12 d-flex justify-content-center px-5 my-3">
					<Button className="w-100" size="lg" variant="success" to="/guides" href="/guides" as={Link}>
						新進員工指南
					</Button>
				</Col>
				<Col sm="6" className="col-12 d-flex justify-content-center px-5 my-3" gap={5}>
					<Button
						className="w-100"
						size="lg"
						variant="success"
						to="/employeeManagement"
						href="/employeeManagement"
						as={Link}>
						員工管理
					</Button>
				</Col>
				<Col sm="6" className="col-12 d-flex justify-content-center px-5 my-3">
					<Button
						className="w-100"
						size="lg"
						variant="success"
						to="/stockManagement"
						href="/stockManagement"
						as={Link}>
						庫存管理
					</Button>
				</Col>
				<Col sm="6" className="col-12 d-flex justify-content-center px-5 my-3">
					<Button
						className="w-100"
						size="lg"
						variant="success"
						to="/storeManagement"
						href="/storeManagement"
						as={Link}>
						店面管理
					</Button>
				</Col>
				<Col sm="6" className="col-12 d-flex justify-content-center px-5 my-3">
					<Button className="w-100" size="lg" variant="success" to="/password" href="/password" as={Link}>
						修改密碼
					</Button>
				</Col>
			</Row>
		</Container>
	);
}
