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
  IconButton,
} from "@mui/material";
import requests from "./requests";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import "./table.css";

let tableData = [];

export default function TableComponentAnalitcsStyle({
  startDate,
  endDate,
  program,
  programStage,
  attribute,
  attributes,
  dataElement,
  dataElements,
  todosAttributos,
  orgUnit,
  refresh,
}) {
  const [headCells, setHeadCells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    if (
      program === null &&
      orgUnit === null &&
      attributes === null &&
      dataElements.length <= 0
    )
      return;

    setIsLoading(true);
    let headCellsAux = {};

    todosAttributos.forEach((at) => {
      headCellsAux[`pa_${at.trackedEntityAttribute.id}`] = {
        id: `pa_${at.trackedEntityAttribute.id}`,
        label: at.trackedEntityAttribute.displayName,
      };
    });
    dataElements.forEach((de) => {
      headCellsAux[`de_${de.dataElement.id}`] = {
        id: `de_${de.dataElement.id}`,
        label: de.dataElement.displayName,
      };
    });

    //outputType = EVENT | ENROLLMENT | TRACKED_ENTITY_INSTANCE

    //console.log(todosAttributos);

    const [requestAnalitcsEvents] = await Promise.all([
      requests.getAnalyticsEnrollments(
        `${program.id}.json?dimension=ou:${
          orgUnit.id
        }&startDate=${startDate}&endDate=${endDate}&stage=${
          programStage.id
        }&outputType=ENROLLMENT&${dataElements
          .map((de) => `dimension=${programStage.id}.${de.dataElement.id}`)
          .join("&")}&paging=false&_=${new Date().getTime()}&${todosAttributos
          .map(
            (at) =>
              `dimension=${programStage.id}.${at.trackedEntityAttribute.id}`
          )
          .join("&")}&paging=false&_=${new Date().getTime()}`
      ),
    ]);

    tableData = [];

    requestAnalitcsEvents.data.headers.forEach((h, index) => {
      if (headCellsAux[`de_${h.name}`] !== undefined) {
        headCellsAux[`de_${h.name}`].index = index;
      }

      if (headCellsAux[`pa_${h.name}`] !== undefined) {
        headCellsAux[`pa_${h.name}`].index = index;
      }
    });

    setHeadCells(Object.values(headCellsAux));

    requestAnalitcsEvents.data.rows.forEach((h, index) => {
      let row = {};
      headCells.forEach((hc, j) => {
        row[hc.id] = h[hc.index];
      });
      tableData.push(row);
    });

    console.log(tableData);

    setIsLoading(false);
  }

  function transferirEventos() {}

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
      <Box style={{ width: "100%" }} display={"flex"}>
        <Box style={{ paddingTop: "20px" }}>
          {program !== null ? program.displayName : ""} &nbsp;&nbsp;
        </Box>
        <Box flexGrow={1}>
          <TextField
            fullWidth
            variant="standard"
            size="small"
            name="pesquisar"
            label="Pesquisar..."
          />{" "}
          &nbsp;
        </Box>
        <Box style={{ paddingTop: "10px" }}>
          <IconButton size="small">
            <ViewColumnIcon />
          </IconButton>
        </Box>
      </Box>
      <div role="region" aria-labelledby="caption" tabindex="0">
        <table>
          <thead>
            <tr>
              {headCells.map((hc) => (
                <th key={hc.id}>{hc.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headCells.map((th, index) =>
                  index === 0 ? (
                    <th key={index}>{row[th.id]}</th>
                  ) : (
                    <td key={index}>{row[th.id]}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/*

{
      "created": "2021-06-14T12:29:31.189",
      "orgUnit": "CoClgIhuI3q",
      "createdAtClient": "2021-06-14T12:29:31.189",
      "trackedEntityInstance": "eElbT3j4lbT",
      "lastUpdated": "2021-06-16T09:19:50.763",
      "trackedEntityType": "nIuPzDo3ybZ",
      "lastUpdatedAtClient": "2021-06-14T12:29:31.189",
      "inactive": false,
      "deleted": false,
      "featureType": "NONE",
      "programOwners": [],
      "enrollments": [],
      "relationships": [],
      "attributes": [
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Contacto do beneficiário",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "PHONE_NUMBER",
          "attribute": "xgwTtBAfCxi",
          "value": "843822711"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Foi alcançado por um projecto de HIV nos últimos 12 meses?",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "TEXT",
          "attribute": "sGSPpz1tsg9",
          "value": "(1) Sim-PASSOS"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Data de Nascimento",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "DATE",
          "attribute": "nlUDFg5KtOs",
          "value": "1996-06-09"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Nacionalidade do Beneficiário",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "TEXT",
          "attribute": "uwmflwnAguU",
          "value": "Moçambique"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Sexo",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "TEXT",
          "attribute": "DkQV2lkAIlY",
          "value": "2"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Já testou alguma vez?",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "TEXT",
          "attribute": "lWM5Mk6BEXG",
          "value": "Não"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Tipo de Mobilizador",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "TEXT",
          "attribute": "ah1nyyKFuoC",
          "value": "Educadora de par"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Provincia ou País de Nascimento",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "TEXT",
          "attribute": "hYg7kjKJgDP",
          "value": "10"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Código de Identificação Único",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "TEXT",
          "attribute": "BNYljBD7Rw2",
          "value": "jF-2-09-06-96-10"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Nome do/a Activista",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "TEXT",
          "attribute": "k3vNJylhw3N",
          "value": "fatima Eduardo"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Nome do beneficiario (1º nome)",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "TEXT",
          "attribute": "rcmjRK2SQKQ",
          "value": "jose"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Grupo de MTS",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "TEXT",
          "attribute": "MebfWRRzyOI",
          "value": "MTS"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Nome do beneficiario (Apelido)",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "TEXT",
          "attribute": "ryw7JSiv1JC",
          "value": "Fátima Eduardo"
        },
        {
          "lastUpdated": "2021-06-14T00:00:00.000",
          "storedBy": "tracker_test",
          "displayName": "Idade do Beneficiário",
          "created": "2021-06-14T00:00:00.000",
          "valueType": "INTEGER_POSITIVE",
          "attribute": "LVGzo5fDJVU",
          "value": "25"
        }
      ]
    }

*/
