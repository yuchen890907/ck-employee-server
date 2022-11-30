import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Authorization, DataTableController } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

export default function SuppliersPage() {
  const { dataState } = useStateContext();
  const tableName = "suppliers";
  return (
    <Authorization>
      <Container>
        {(dataState && dataState[tableName] && (
          <DataTableController id="suppliers" title="供應商資訊" tableName={tableName}></DataTableController>
        )) ||
          "您沒有查詢的權限"}
      </Container>
    </Authorization>
  );
}
