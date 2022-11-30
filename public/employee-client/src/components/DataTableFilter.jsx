import React from "react";
import { useState } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import { useStateContext } from "../contexts/ContextProvider";

const DataTableFilter = ({ children }) => {
	let subComponentList = Object.values(DataTableFilter);
	let subComponents = subComponentList.map((key) => {
		return React.Children.map(children, (child) => {
			return child.type === key ? child : null;
		});
	});
	return <div className="filter">{subComponents.map((component) => component)}</div>;
};

const Number = ({ label, column, min, max }) => {
	const { setFilter } = useStateContext();
	if (min || max)
		return (
			<InputGroup className="mb-3">
				<InputGroup.Text>{label}</InputGroup.Text>
				{min && (
					<FormControl
						type="number"
						min="0"
						onChange={(e) => {
							if (e.target.value) setFilter(`${column}-min`, (record) => record[column] >= e.target.value);
							else setFilter(`${column}-min`, null);
						}}
					/>
				)}
				{min && max && <InputGroup.Text>到</InputGroup.Text>}
				{max && (
					<FormControl
						type="number"
						min="0"
						onChange={(e) => {
							if (e.target.value) setFilter(`${column}-max`, (record) => record[column] <= e.target.value);
							else setFilter(`${column}-max`, null);
						}}
					/>
				)}
			</InputGroup>
		);
};
DataTableFilter.Number = Number;

const Select = ({ label, refTable, column, cname, refColumn }) => {
	const { dataState, setFilter } = useStateContext();
	return (
		<InputGroup className="mb-3">
			<InputGroup.Text>{label}</InputGroup.Text>
			<Form.Select
				onChange={(e) => {
					if (e.target.value)
						setFilter(`${column}`, (record) => {
							return record[column] === e.target.value;
						});
					else setFilter(`${column}`, null);
				}}>
				<option value="">全部</option>
				{dataState &&
					dataState[refTable] &&
					dataState[refTable].data.map((record, i) => {
						return (
							<option key={`op-${i}`} value={record[refColumn]}>
								{record[cname]}
							</option>
						);
					})}
			</Form.Select>
		</InputGroup>
	);
};
DataTableFilter.Select = Select;

const Compare = ({ label, columns, compare }) => {
	const { setFilter } = useStateContext();
	const [check, setCheck] = useState(false);
	return (
		<InputGroup className="mb-3">
			<InputGroup.Checkbox
				check={`'${check}'`}
				onChange={() => {
					if (!check) {
						if (compare === "l")
							setFilter(
								`compare-${columns[0]}-${columns[1]}`,
								(record) => record[columns[0]] < record[columns[1]]
							);
						else if (compare === "le")
							setFilter(
								`compare-${columns[0]}-${columns[1]}`,
								(record) => record[columns[0]] <= record[columns[1]]
							);
						else if (compare === "g")
							setFilter(
								`compare-${columns[0]}-${columns[1]}`,
								(record) => record[columns[0]] > record[columns[1]]
							);
						else if (compare === "ge")
							setFilter(
								`compare-${columns[0]}-${columns[1]}`,
								(record) => record[columns[0]] >= record[columns[1]]
							);
						else setFilter(`compare-${columns[0]}-${columns[1]}`, null);
					} else setFilter(`compare-${columns[0]}-${columns[1]}`, null);
					setCheck((pre) => !pre);
				}}
			/>
			<InputGroup.Text>{label}</InputGroup.Text>
		</InputGroup>
	);
};
DataTableFilter.Compare = Compare;

const Time = ({ type, label, column }) => {
	const { dataState, setFilter } = useStateContext();
	return (
		<InputGroup className="mb-3">
			<InputGroup.Text>{label}</InputGroup.Text>
			<FormControl
				type={type}
				min="0"
				step="1"
				onChange={(e) => {
					if (e.target.value) setFilter(`${column}-min`, (record) => record[column] >= e.target.value);
					else setFilter(`${column}-min`, null);
				}}
			/>
			<InputGroup.Text>到</InputGroup.Text>
			<FormControl
				type={type}
				min="0"
				step="1"
				onChange={(e) => {
					if (e.target.value) setFilter(`${column}-max`, (record) => record[column] <= e.target.value);
					else setFilter(`${column}-max`, null);
				}}
			/>
		</InputGroup>
	);
};
DataTableFilter.Time = Time;

export default DataTableFilter;
