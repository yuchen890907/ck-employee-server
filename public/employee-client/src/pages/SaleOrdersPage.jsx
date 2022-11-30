import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Authorization, DataTableFilter, DataTableViewer } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

export default function SaleOrdersPage() {
	const { dataState } = useStateContext();
	const tableName = "sales";
	const subTableName = "saledetails";
	return (
		<Authorization>
			<Container>
				{(dataState && dataState[tableName] && (
					<DataTableViewer
						id="purchases"
						title="訂單紀錄"
						subTitle="訂單明細"
						detail
						tableName={tableName}
						subTableName={subTableName}
						subQueryKey="saleInvoice">
						<DataTableFilter>
							<DataTableFilter.Time label="訂單日期" column="saleDateTime" type="date" />
							<DataTableFilter.Number label="金額" column="total" min max />
						</DataTableFilter>
					</DataTableViewer>
				)) ||
					"您沒有查詢的權限"}
			</Container>
		</Authorization>
	);
}
