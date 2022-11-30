import React from "react";
import { Container } from "react-bootstrap";
import { Authorization, DataTableController, DataTableFilter } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

export default function SOPRecordsPage() {
  const { dataState } = useStateContext();
  const tableName = "soprecords";
  const type = {
    keys: ["registerDateTime", "sopClass", "eAccount"],
    settings: [
      { type: "datetime-local" },
      {
        type: "foreignKey",
        ref: "sopform",
        column: "sopClass",
        cname: "sopClass",
      },
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
          <DataTableController id="soprecords" title="開閉店紀錄查詢" tableName={tableName} type={type}>
            <DataTableFilter>
              <DataTableFilter.Time label="編輯時間" type="datetime-local" column="registerDateTime" />
            </DataTableFilter>
          </DataTableController>
        )) ||
          "載入中...."}
      </Container>
    </Authorization>
  );
}
