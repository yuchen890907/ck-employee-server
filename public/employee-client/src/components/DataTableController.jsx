import React, { useEffect, useState } from "react";
import {
	Alert,
	Button,
	Card,
	Col,
	Dropdown,
	Form,
	FormControl,
	InputGroup,
	Modal,
	Row,
	Spinner,
	Table,
} from "react-bootstrap";
import $ from "jquery";
import "datatables.net-bs5";
import { useStateContext } from "../contexts/ContextProvider";

export default function DataTableController(props) {
	const { id, title, tableName, type, children } = props;
	const { loginState, dataState, APIState, filterState, setFilterState } = useStateContext();
	let o = {};
	dataState[tableName].schemas.forEach((d) => (o[d] = ""));
	const emptyEditor = {
		index: -1,
		data: o,
		labels: dataState[tableName].labels,
	};
	const [table, setTable] = useState(null);
	const [tableState, setTableState] = useState(
		props.edit ? makeActionData(dataState[tableName]) : dataState[tableName].data
	);
	const [editorState, setEditorState] = useState(emptyEditor);
	const [labelState] = useState(
		props.edit ? [...dataState[tableName].labels, "Actions"] : [...dataState[tableName].labels]
	);
	const [schemaState] = useState(
		props.edit ? [...dataState[tableName].schemas, "Actions"] : [...dataState[tableName].schemas]
	);
	const [filterDataState, setFilterDataState] = useState(tableState);
	const [showState, setShowState] = useState({
		addModal: false,
		editModal: false,
		deleteModal: false,
		filterModal: false,
	});
	const [errorMessage, setErrorMessage] = useState("");

	const addModalClosedHandler = () => {
		setShowState((pre) => {
			let o = { ...pre };
			o.addModal = false;
			return o;
		});
		setEditorState(emptyEditor);
		setErrorMessage("");
	};
	const editModalClosedHandler = () => {
		setShowState((pre) => {
			let o = { ...pre };
			o.editModal = false;
			return o;
		});
		setEditorState(emptyEditor);
		setErrorMessage("");
	};
	const deleteModalClosedHandler = () => {
		setShowState((pre) => {
			let o = { ...pre };
			o.deleteModal = false;
			return o;
		});
		setEditorState(emptyEditor);
	};
	const filterModalClosedHandler = () => {
		setShowState((pre) => {
			let o = { ...pre };
			o.filterModal = false;
			return o;
		});
	};
	useEffect(() => {
		if (props.edit) setTableState(makeActionData(dataState[tableName]));
		else setTableState(dataState[tableName].data);
		// eslint-disable-next-line
	}, [dataState[tableName]]);

	useEffect(() => {
		setFilterDataState((pre) => {
			if (filterState.length)
				return [
					...tableState.filter((record) => {
						let found = true;
						filterState.forEach((filter) => {
							if (!filter[1](record)) found = false;
						});
						return found;
					}),
				];
			return [...tableState];
		});
		if (table) table.destroy();
	}, [filterState, tableState]);

	useEffect(() => {
		$(document).ready(() => setTable($("#" + id).DataTable()));
		// eslint-disable-next-line
	}, [filterDataState]);

	useEffect(() => {
		if (props.edit) setTableState(makeActionData(dataState[tableName]));
		else setTableState(dataState[tableName].data);
		return () => {
			setFilterState([]);
		};
	}, []);
	return (
		<>
			<Card className="shadow border-0 my-3">
				<Card.Header className="px-4 py-2 pt-3 fs-5">
					<Row>
						<Col>{title}</Col>
						<Col>
							{(props.edit || children) && (
								<Dropdown className="d-flex justify-content-end">
									<Dropdown.Toggle variant="transparent" />
									<Dropdown.Menu>
										{children && (
											<Dropdown.Item
												onClick={() => {
													setShowState((pre) => {
														let o = { ...pre };
														o.filterModal = true;
														return o;
													});
												}}>
												進階查詢
											</Dropdown.Item>
										)}
										{props.edit && (
											<Dropdown.Item
												onClick={() => {
													setShowState((pre) => {
														let o = { ...pre };
														o.addModal = true;
														return o;
													});
													if (type && type.useUser) {
														setEditorState((pre) => {
															let o = JSON.parse(JSON.stringify(pre));
															type.useUser.forEach((setting) => {
																o.data[setting[0]] = loginState.user[setting[1]];
															});
															return o;
														});
													}
												}}>
												新增紀錄
											</Dropdown.Item>
										)}
									</Dropdown.Menu>
								</Dropdown>
							)}
						</Col>
					</Row>
				</Card.Header>
				<Card.Body>
					<Table id={id}>
						<thead>
							<tr>
								{labelState.map((d, i) => {
									if (type) {
										if (type.keys.includes(schemaState[i])) {
											const pos = type.keys.findIndex((key) => key === schemaState[i]);
											if (
												type.settings[pos].type === "password" ||
												type.settings[pos].type === "disable"
											)
												return null;
										}
									}
									return <th key={`th-${i}`}>{d}</th>;
								})}
							</tr>
						</thead>
						<tbody>
							{filterDataState.map((record, row) => {
								return (
									<tr key={`tr-${row}`}>
										{schemaState.map((property, col) => {
											if (type) {
												const pos = type.keys.findIndex((key) => key === property);
												if (pos !== -1) {
													if (
														type.settings[pos].type === "password" ||
														type.settings[pos].type === "disable"
													)
														return null;
													if (type.settings[pos].type === "foreignKey")
														return (
															<td key={`td-${row}-${col}`}>
																{
																	dataState[type.settings[pos].ref].data.find(
																		(el) =>
																			el[type.settings[pos].column] ===
																			record[property]
																	)[type.settings[pos].cname]
																}
															</td>
														);
													if (type.settings[pos].type === "file")
														return (
															<td key={`td-${row}-${col}`}>
																<a href={record[property]} target="_blank">
																	下載
																</a>
															</td>
														);
												}
											}
											return <td key={`td-${row}-${col}`}>{record[property]}</td>;
										})}
									</tr>
								);
							})}
						</tbody>
					</Table>
				</Card.Body>
			</Card>
			<Modal show={showState.filterModal} onHide={filterModalClosedHandler}>
				<Modal.Header closeButton>
					<Modal.Title> 進階查詢</Modal.Title>
				</Modal.Header>
				<Modal.Body>{children}</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => {
							setFilterState([]);
						}}>
						清除
					</Button>
					<Button variant="primary" onClick={filterModalClosedHandler}>
						確認
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showState.addModal} onHide={addModalClosedHandler}>
				<Modal.Header closeButton>
					<Modal.Title> 新增資料</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Alert variant="danger" show={errorMessage.length > 0}>
						{errorMessage}
					</Alert>
					{dataState[tableName].schemas.map((d, i) => {
						if (type) {
							const pos = type.keys.findIndex((key) => key === d);
							if (pos !== -1)
								if (type.settings[pos].type === "foreignKey")
									return (
										<InputGroup key={`in-${d}`} className="mb-3">
											<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
											<Form.Select
												key={`in-s${d}`}
												value={editorState.data[d]}
												onChange={(e) => {
													setEditorState((pre) => {
														let o = JSON.parse(JSON.stringify(pre));
														o.data[d] = e.target.value;
														return o;
													});
												}}>
												<option value="" disabled>
													請選擇
												</option>
												{dataState[type.settings[pos].ref] &&
													dataState[type.settings[pos].ref].data.map((record, ii) => {
														return (
															<option
																key={`in-${d}-${ii}`}
																value={record[type.settings[pos].column]}>
																{record[type.settings[pos].cname]}
															</option>
														);
													})}
											</Form.Select>
										</InputGroup>
									);
								else if (type.settings[pos].type === "primary") {
									return (
										<InputGroup key={`in-${d}`} className="mb-3">
											<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
											<FormControl value={editorState.data[d]} disabled />
										</InputGroup>
									);
								} else if (
									type.settings[pos].type === "datetime-local" ||
									type.settings[pos].type === "date" ||
									type.settings[pos].type === "password"
								)
									return (
										<InputGroup key={`in-${d}`} className="mb-3">
											<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
											<input
												type={type.settings[pos].type}
												value={editorState.data[d]}
												className="form-control"
												onChange={(e) => {
													setEditorState((pre) => {
														let o = JSON.parse(JSON.stringify(pre));
														o.data[d] = e.target.value;
														return o;
													});
												}}
											/>
										</InputGroup>
									);
								else if (type.settings[pos].type === "time")
									return (
										<InputGroup key={`in-${d}`} className="mb-3">
											<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
											<input
												type={type.settings[pos].type}
												value={editorState.data[d]}
												min="00:00:00"
												step="1"
												className="form-control"
												onChange={(e) => {
													setEditorState((pre) => {
														let o = JSON.parse(JSON.stringify(pre));
														o.data[d] = e.target.value;
														return o;
													});
												}}
											/>
										</InputGroup>
									);
								else if (type.settings[pos].type === "enum")
									return (
										<InputGroup key={`in-${d}`} className="mb-3">
											<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
											<Form.Select
												key={`in-${d}`}
												value={editorState.data[d]}
												onChange={(e) => {
													setEditorState((pre) => {
														let o = JSON.parse(JSON.stringify(pre));
														o.data[d] = e.target.value;
														return o;
													});
												}}>
												<option value="" disabled>
													請選擇
												</option>
												{type.settings[pos].values.map((str, ii) => (
													<option key={`in-${d}-${ii}`} value={str}>
														{str}
													</option>
												))}
											</Form.Select>
										</InputGroup>
									);
								else if (type.settings[pos].type === "file")
									return <Uploader key={`in-${d}`} pos={pos} d={d} />;
								else if (
									type.settings[pos].type === "disable" ||
									type.settings[pos].type === "user" ||
									type.settings[pos].type === "auto"
								)
									return null;
						}
						return (
							<InputGroup key={`in-${d}`} className="mb-3">
								<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
								<FormControl
									value={editorState.data[d]}
									onChange={(e) => {
										setEditorState((pre) => {
											let o = JSON.parse(JSON.stringify(pre));
											o.data[d] = e.target.value;
											return o;
										});
									}}
								/>
							</InputGroup>
						);
					})}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={addModalClosedHandler}>
						取消
					</Button>
					<Button
						variant="primary"
						onClick={async () => {
							const error = await APIState.insertOne(tableName, editorState.data);
							if (error) setErrorMessage(error);
							else addModalClosedHandler();
						}}>
						確認新增
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showState.editModal} onHide={editModalClosedHandler}>
				<Modal.Header closeButton>
					<Modal.Title> 編輯</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Alert variant="danger" show={errorMessage.length > 0}>
						{errorMessage}
					</Alert>
					{dataState[tableName].schemas.map((d, i) => {
						if (type) {
							const pos = type.keys.findIndex((key) => key === d);
							if (pos !== -1)
								if (type.settings[pos].type === "foreignKey")
									return (
										<InputGroup key={`in-${d}`} className="mb-3">
											<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
											<Form.Select
												key={`in-s${d}`}
												value={editorState.data[d]}
												onChange={(e) => {
													setEditorState((pre) => {
														let o = JSON.parse(JSON.stringify(pre));
														o.data[d] = e.target.value;
														return o;
													});
												}}>
												<option value="" disabled>
													請選擇
												</option>
												{dataState[type.settings[pos].ref] &&
													dataState[type.settings[pos].ref].data.map((record, ii) => (
														<option
															key={`in-${d}-${ii}`}
															value={record[type.settings[pos].column]}>
															{record[type.settings[pos].cname]}
														</option>
													))}
											</Form.Select>
										</InputGroup>
									);
								else if (type.settings[pos].type === "primary") {
									return (
										<InputGroup key={`in-${d}`} className="mb-3">
											<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
											<FormControl value={editorState.data[d]} disabled />
										</InputGroup>
									);
								} else if (
									type.settings[pos].type === "datetime-local" ||
									type.settings[pos].type === "date"
								)
									return (
										<InputGroup key={`in-${d}`} className="mb-3">
											<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
											<input
												type={type.settings[pos].type}
												value={editorState.data[d]}
												className="form-control"
												onChange={(e) => {
													setEditorState((pre) => {
														let o = JSON.parse(JSON.stringify(pre));
														o.data[d] = e.target.value;
														return o;
													});
												}}
											/>
										</InputGroup>
									);
								else if (type.settings[pos].type === "time")
									return (
										<InputGroup key={`in-${d}`} className="mb-3">
											<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
											<input
												type={type.settings[pos].type}
												value={editorState.data[d]}
												min="00:00:00"
												step="1"
												className="form-control"
												onChange={(e) => {
													setEditorState((pre) => {
														let o = JSON.parse(JSON.stringify(pre));
														o.data[d] = e.target.value;
														return o;
													});
												}}
											/>
										</InputGroup>
									);
								else if (type.settings[pos].type === "enum")
									return (
										<InputGroup key={`in-${d}`} className="mb-3">
											<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
											<Form.Select
												key={`in-${d}`}
												value={editorState.data[d]}
												onChange={(e) => {
													setEditorState((pre) => {
														let o = JSON.parse(JSON.stringify(pre));
														o.data[d] = e.target.value;
														return o;
													});
												}}>
												<option value="" disabled>
													請選擇
												</option>
												{type.settings[pos].values.map((str, ii) => (
													<option key={`in-${d}-${ii}`} value={str}>
														{str}
													</option>
												))}
											</Form.Select>
										</InputGroup>
									);
								else if (type.settings[pos].type === "file")
									return <Uploader key={`in-${d}`} pos={pos} d={d} />;
								else if (
									type.settings[pos].type === "password" ||
									type.settings[pos].type === "disable" ||
									type.settings[pos].type === "user" ||
									type.settings[pos].type === "auto"
								)
									return null;
						}
						return (
							<InputGroup key={`in-${d}`} className="mb-3">
								<InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text>
								<FormControl
									value={editorState.data[d]}
									onChange={(e) => {
										setEditorState((pre) => {
											let o = JSON.parse(JSON.stringify(pre));
											o.data[d] = e.target.value;
											return o;
										});
									}}
								/>
							</InputGroup>
						);
					})}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={editModalClosedHandler}>
						取消
					</Button>
					<Button
						variant="primary"
						onClick={async () => {
							const error = await APIState.updateOne(tableName, editorState.data, editorState.index);
							if (error) setErrorMessage(error);
							else editModalClosedHandler();
						}}>
						確認編輯
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showState.deleteModal} onHide={deleteModalClosedHandler} contentClassName="rounded-5 shadow">
				<Modal.Header closeButton>
					<Modal.Title> 確認移除資料</Modal.Title>
				</Modal.Header>
				<Modal.Body>此動作不可復原，您確定要移除此筆資料嗎?</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={deleteModalClosedHandler}>
						取消
					</Button>
					<Button
						variant="danger"
						onClick={async () => {
							const error = await APIState.deleteOne(tableName, editorState.data, editorState.index);
							if (error) console.log(error);
							else deleteModalClosedHandler();
						}}>
						確認移除
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
	function Uploader({ d, pos }) {
		const [files, setFiles] = useState();
		const [uploading, setUploading] = useState(false);
		const [message, setMessage] = useState("");
		return (
			<>
				<InputGroup className="mb-3">
					{/* <InputGroup.Text>{dataState[tableName].labels[i]}</InputGroup.Text> */}
					{editorState.data.files ? (
						<>
							<InputGroup.Text disable>已選擇檔案</InputGroup.Text>
							<FormControl type="text" value={editorState.data.files[0].name} />
						</>
					) : (
						<>
							<input
								type="file"
								accept={type.settings[pos].type === "file" ? "*" : "image/*"}
								// value={editorState.data[d]}
								className="form-control"
								onChange={(e) => {
									setFiles(e.target.files);
								}}
							/>
							<Button
								onClick={async (e) => {
									setUploading(true);
									if (files) {
										setMessage("");
										const res = await APIState.uploadFile(files[0]);
										if (res.success)
											setEditorState((pre) => {
												let o = JSON.parse(JSON.stringify(pre));
												o.data[d] = res.file.url;
												o.data.files = files;
												return o;
											});
										else setMessage(res.message);
									} else {
										setMessage("請選擇檔案");
									}
									setUploading(false);
								}}
								disabled={uploading}>
								{uploading ? (
									<span>
										<Spinner animation="border" role="status" />
									</span>
								) : (
									"上傳"
								)}
							</Button>
						</>
					)}
				</InputGroup>
				<Alert show={message.length > 0}>{message}</Alert>
			</>
		);
	}
	function makeActionData(state) {
		return state.data.map((record, i) => {
			let o = JSON.parse(JSON.stringify(record));
			o.Actions = (
				<>
					<Button
						variant="transparent"
						className="px-1 py-0"
						onClick={() => {
							setShowState((pre) => {
								let o = { ...pre };
								o.editModal = true;
								return o;
							});
							setEditorState((pre) => {
								let o = { ...pre };
								o.index = i;
								o.data = state.data[i];
								return o;
							});
							if (type && type.useUser) {
								setEditorState((pre) => {
									let o = JSON.parse(JSON.stringify(pre));
									type.useUser.forEach((setting) => {
										o.data[setting[0]] = loginState.user[setting[1]];
									});
									return o;
								});
							}
						}}>
						<i className="bi bi-pencil-square" />
					</Button>
					<Button
						variant="transparent"
						className="px-1 py-0"
						onClick={() => {
							setShowState((pre) => {
								let o = { ...pre };
								o.deleteModal = true;
								return o;
							});
							setEditorState((pre) => {
								let o = { ...pre };
								o.index = i;
								o.data = state.data[i];
								return o;
							});
						}}>
						<i className="bi bi-trash" />
					</Button>
				</>
			);
			return o;
		});
	}
}
