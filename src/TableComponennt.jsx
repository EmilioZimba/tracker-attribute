import React, { useEffect, useState } from "react";
import {
  Fab,
  Table,
  Box,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TextField,
  // IconButton,
  // Typography,
  // Popover,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
//import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import requests from "./requests";

let teiMap = {};

let tableHeadMap = [];

export default function TableComponennt({
  startDate,
  endDate,
  program,
  attribute,
  attributes,
  dataElement,
  orgUnit,
  refresh,
}) {
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    console.log(dataElement);
    setIsLoading(true);
    if (
      program === null &&
      orgUnit === null &&
      attribute === null &&
      dataElement === undefined
    )
      return;
    const [requestEvents, requestTEIS] = await Promise.all([
      requests.getEvents(program.id, orgUnit.id, startDate, endDate),
      requests.getTrackedEntityInstances(
        `/query.json?ouMode=SELECTED&order=created:desc&programStartDate=${startDate}&programEndDate=${endDate}&ou=${orgUnit.id}&program=${program.id}`
      ),
    ]);

    tableHeadMap = [];
    teiMap = {};

    requestTEIS.data.headers.forEach((tei, index) => {
      tableHeadMap.push({ id: tei.name, label: tei.column, index: index });
    });

    requestTEIS.data.rows.forEach((tei) => {
      tableHeadMap.forEach((hmp) => {
        teiMap[tei[tableHeadMap[0].index]] = {
          ...teiMap[tei[tableHeadMap[0].index]],
          [hmp.id]: tei[hmp.index],
        };
      });
      teiMap[tei[tableHeadMap[0].index]] = {
        ...teiMap[tei[tableHeadMap[0].index]],
        [`_${dataElement.dataElement.id}`]: null,
      };
    });

    tableHeadMap.push({
      id: `_${dataElement.dataElement.id}`,
      label: dataElement.dataElement.displayName,
      index: -1,
    });

    requestEvents.data.events.forEach((evento) => {
      if (teiMap[evento['trackedEntityInstance']] === undefined) return;

      if (evento['dataValues'].length > 0) {
        evento['dataValues'].forEach((dataValue) => {
          if (
            dataValue.dataElement === dataElement.dataElement.id &&
            teiMap[evento['trackedEntityInstance']][
              `_${dataElement.dataElement.id}`
            ] === null
          ) {
            teiMap[evento['trackedEntityInstance']][
              `_${dataElement.dataElement.id}`
            ] = dataValue.value;
          }
        });
      }
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [refresh]);

  if (isLoading)
    return (
      <Box style={{ paddingTop: "200px", textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Fab
        onClick={loadData}
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
        color="primary"
      >
        <SaveIcon />
      </Fab>
      <Box display="flex">
        <Box flexGrow={1}>
          <TextField variant="standard" label="Pesquisar..." name="search" />
        </Box>
        <Box></Box>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            {tableHeadMap.map((x, i) => (
              <TableCell key={i}>{x.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(teiMap).map((valor, indice) => (
            <TableRow key={indice}>
              {tableHeadMap.map((hc) => (
                <TableCell key={hc.index}>{valor[hc.id]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
