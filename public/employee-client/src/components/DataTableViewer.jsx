import React, { useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, Modal, Row, Table } from "react-bootstrap";
import $ from "jquery";
import "datatables.net-bs5";
import { useStateContext } from "../contexts/ContextProvider";
import { DataTableController } from "./";

export default function DataTableViewer(props) {
  const { id, title, tableName, subTableName, type, subType, edit, children } = props;
  const { dataState, APIState, setDataState, filterState, setFilterState } = useStateContext();
  let o = {};
  dataState[tableName].schemas.forEach((d) => (o[d] = ""));

  const [table, setTable] = useState(null);
  const [tableState, setTableState] = useState(
    props.detail ? makeActionData(dataState[tableName]) : dataState[tableName].data
  );
  const [labelState] = useState(
    props.detail ? [...dataState[tableName].labels, "Actions"] : [...dataState[tableName].labels]
  );
  const [schemaState] = useState(
    props.detail ? [...dataState[tableName].schemas, "Actions"] : [...dataState[tableName].schemas]
  );
  const [filterDataState, setFilterDataState] = useState(tableState);
  const [showState, setShowState] = useState({
    detailModal: false,
    filterModal: false,
  });

  const detailModalClosedHandler = () => {
    setShowState((pre) => {
      let o = { ...pre };
      o.detailModal = false;
      return o;
    });
  };
  const filterModalClosedHandler = () => {
    setShowState((pre) => {
      let o = { ...pre };
      o.filterModal = false;
      return o;
    });
  };
  useEffect(() => {
    if (props.detail) setTableState(makeActionData(dataState[tableName]));
    else setTableState(dataState[tableName].data);
    // eslint-disable-next-line
  }, [dataState[tableName]]);

  useEffect(() => {
    setFilterDataState(() => {
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
  useEffect(() => () => setFilterState([]), []);
  return (
    <>
      <Card className="shadow border-0 my-3">
        <Card.Header className="px-4 py-2 pt-3 fs-5">
          <Row>
            <Col>{title}</Col>
            <Col>
              {children && (
                <Dropdown className="d-flex justify-content-end">
                  <Dropdown.Toggle variant="transparent" />
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        setShowState((pre) => {
                          let o = { ...pre };
                          o.filterModal = true;
                          return o;
                        });
                      }}
                    >
                      進階查詢
                    </Dropdown.Item>
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
                      if (type.settings[pos].type == "password") return null;
                    }
                  }
                  return <th key={`th-${i}`}>{d}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {filterDataState.map((record, row) => (
                <tr key={`tr-${row}`}>
                  {schemaState.map((property, col) => {
                    if (type) {
                      const pos = type.keys.findIndex((key) => key === property);
                      if (pos !== -1) {
                        if (type.settings[pos].type == "password") return null;
                        if (type.settings[pos].type == "foreignKey")
                          return (
                            <td key={`td-${row}-${col}`}>
                              {
                                dataState[type.settings[pos].ref].data.find(
                                  (el) => el[type.settings[pos].column] === record[property]
                                )[type.settings[pos].cname]
                              }
                            </td>
                          );
                      }
                    }
                    return <td key={`td-${row}-${col}`}>{record[property]}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal
        show={showState.detailModal}
        onHide={detailModalClosedHandler}
        size="xl"
        contentClassName="rounded-5 shadow"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {dataState[subTableName] && (
            <DataTableController
              id={subTableName}
              title={props.subTitle}
              tableName={subTableName}
              type={subType}
              edit={edit}
            />
          )}
        </Modal.Body>
      </Modal>
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
            }}
          >
            清除
          </Button>
          <Button variant="primary" onClick={filterModalClosedHandler}>
            確認
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  function makeActionData(state) {
    return state.data.map((record, i) => {
      let o = JSON.parse(JSON.stringify(record));
      o.Actions = (
        <>
          <Button
            variant="transparent"
            className="px-1 py-0"
            onClick={async () => {
              const res = await APIState.findOneByKey(
                tableName,
                props.subQueryKey,
                dataState[tableName].data[i][props.subQueryKey]
              );
              if (res.success) {
                setDataState({
                  table: props.subTableName,
                  actions: res.data,
                });
                setShowState((pre) => {
                  let o = { ...pre };
                  o.detailModal = true;
                  return o;
                });
              }
            }}
          >
            <i className="bi bi-three-dots" />
          </Button>
        </>
      );
      return o;
    });
  }
}
