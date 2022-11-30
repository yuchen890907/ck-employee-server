import React from "react";
import { Container } from "react-bootstrap";
import { Authorization, DataTableController, DataTableFilter } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

export default function SchedulesPage() {
  const { dataState } = useStateContext();
  const tableName = "schedules";
  const type = {
    keys: ["scheduleNo", "eAccount", "workDate", "start", "leave"],
    settings: [
      { type: "disable" },
      { type: "foreignKey", ref: "employees", column: "account", cname: "name" },
      { type: "date" },
      { type: "time" },
      { type: "time" },
    ],
  };
  return (
    <Authorization>
      <Container>
        {(dataState && dataState[tableName] && (
          <DataTableController id="schedules" title="班表資訊" tableName={tableName} type={type} edit>
            <DataTableFilter>
              <DataTableFilter.Time label="日期" type="date" column="workDate" />
              <DataTableFilter.Time label="上班時間" type="time" column="start" />
              <DataTableFilter.Time label="下班時間" type="time" column="leave" />
              <DataTableFilter.Select
                label="職員"
                refTable="employees"
                column="eAccount"
                refColumn="account"
                cname="name"
              />
            </DataTableFilter>
          </DataTableController>
        )) ||
          "您沒有查詢的權限"}
      </Container>
    </Authorization>
  );
}
