import React from "react";
import { Authorization, DataTableController, DataTableFilter } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { Container } from "react-bootstrap";

export default function GuidesPage() {
	const { dataState } = useStateContext();
	const tableName = "guides";
	const type = {
		keys: ["dataID", "updateDateTime", "file", "eAccount"],
		settings: [{ type: "disable" }, { type: "auto" }, { type: "file" }, { type: "user" }],
		useUser: [["eAccount", "account"]],
	};
	return (
		<Authorization>
			<Container>
				{(dataState && dataState[tableName] && (
					<DataTableController id="guides" title="新進員工指南" tableName={tableName} type={type} edit>
						<DataTableFilter>
							<DataTableFilter.Time label="更新時間" type="datetime-local" column="updateDateTime" />
						</DataTableFilter>
					</DataTableController>
				)) ||
					"您沒有查詢的權限"}
			</Container>
		</Authorization>
	);
}
