import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Authorization, DataTableFilter, DataTableViewer } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

export default function PurchaseRecordPage() {
  const { dataState } = useStateContext();
  const tableName = "purchases";
  const subTableName = "purchasedetails";
  const type = {
    keys: ["eAccount"],
    settings: [
      {
        type: "foreignKey",
        ref: "employees",
        column: "account",
        cname: "name",
      },
    ],
  };
  return (
    <Authorization>
      <Container>
        {(dataState && dataState[tableName] && (
          <DataTableViewer
            id="purchases"
            title="查詢進貨紀錄"
            subTitle="進貨明細"
            detail
            tableName={tableName}
            subTableName={subTableName}
            type={type}
            subQueryKey="purchaseInvoice"
          >
            <DataTableFilter>
              <DataTableFilter.Time label="進貨日期" column="purchaseDateTime" type="datetime-local" />
              <DataTableFilter.Number label="金額" column="total" min max />
              <DataTableFilter.Select
                label="員工姓名"
                column="eAccount"
                refTable="employees"
                refColumn="account"
                cname="name"
              />
            </DataTableFilter>
          </DataTableViewer>
        )) ||
          "載入中...."}
      </Container>
    </Authorization>
  );
}
