import React, { useEffect, useState } from "react";
import {
  Fab,
  Box,
  CircularProgress,
  TextField,
  IconButton,
  Toolbar,
  Typography,
  MenuItem,
} from "@mui/material";
import requests from "./requests";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DownloadIcon from "@mui/icons-material/Download";
import "./table_no_fixed_columns.css";
import Export, { downloadXLSX, uploadExcel } from "./exportTable";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  FirstPage,
} from "@mui/icons-material";

let tableData = [];

function requestEvents(
  program,
  orgUnits,
  startDate,
  endDate,
  programStage,
  dataElements,
  pageSize,
  pageNumber
) {
  return requests.getAnalyticsEvents(
    `${program.id}.json?dimension=ou:${orgUnits
      .map((x) => x.id)
      .join(";")}&startDate=${startDate}&endDate=${endDate}&stage=${
      programStage.id
    }&outputType=EVENT&${dataElements
      .map((de) => `dimension=${programStage.id}.${de.dataElement.id}`)
      .join(
        "&"
      )}&pageSize=${pageSize}&page=${pageNumber}&_=${new Date().getTime()}&_=${new Date().getTime()}`
  );
}

export default function Analitcs2Excel({
  startDate,
  endDate,
  program,
  programStage,
  dataElements,
  orgUnit,
  orgUnits,
  refresh,
  downloadXLSXFile,
}) {
  const [headCells, setHeadCells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(500);
  const [pageNumber, setPageNumber] = useState(1);

  async function loadData() {
    if (program === null || dataElements.length <= 0) return;

    setIsLoading(true);
    let headCellsAux = {
      pi: { id: "eventdate", label: "EventDate", hide: true, index: 2 },
      ouname: { id: "ouname", label: "OrgUnitName", hide: false, index: 6 },
    };

    dataElements.forEach((de) => {
      headCellsAux[`de_${de.dataElement.id}`] = {
        id: `de_${de.dataElement.id}`,
        label: de.dataElement.displayName,
        hide: false,
      };
    });

    //outputType = EVENT | ENROLLMENT | TRACKED_ENTITY_INSTANCE

    const [requestAnalitcsEvents] = await Promise.all([
      requests.getAnalyticsEvents(
        `${program.id}.json?dimension=ou:${orgUnits
          .map((x) => x.id)
          .join(";")}&startDate=${startDate}&endDate=${endDate}&stage=${
          programStage.id
        }&outputType=EVENT&${dataElements
          .map((de) => `dimension=${programStage.id}.${de.dataElement.id}`)
          .join(
            "&"
          )}&pageSize=${pageSize}&page=${pageNumber}&_=${new Date().getTime()}&_=${new Date().getTime()}`
      ),
    ]);

    setPageCount(requestAnalitcsEvents.data.metaData.pager.pageCount);

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

    /*

    const requestedEvents = await Promise.all(
      Array.from(Array(Number.parseInt(pageCount)).keys()).map((p) =>
        requestEvents(
          program,
          orgUnits,
          startDate,
          endDate,
          programStage,
          dataElements,
          pageSize,
          p + 1
        )
      )
    );

    requestedEvents.forEach((r, i) => {
      let tableExcel = [];
      r.data.rows.forEach((h, index) => {
        let row = {};
        headCells.forEach((hc, j) => {
          row[hc.id] = h[hc.index];
        });
        tableExcel.push(row);
      });

      downloadXLSX(`ATHIV_Q2__ ${i} of ${pageCount}`, headCells, tableExcel);
    });

    */

    setIsLoading(false);
  }

  function transferirEventos() {}

  useEffect(() => {
    loadData();
  }, [refresh, pageNumber, pageSize]);

  useEffect(() => {
    if (program === null || orgUnit === null || dataElements.length <= 0)
      return;
      /*
    downloadXLSX(
      program.displayName + "__" + pageNumber + " of " + pageCount,
      headCells,
      tableData
    );
    */
  }, [downloadXLSXFile]);

  if (isLoading)
    return (
      <Box style={{ paddingTop: "200px", textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Fab
        onClick={() => {
          downloadXLSX(
            'PASSOS '+program.displayName + "__" + pageNumber + " of " + pageCount,
            headCells,
            tableData
          );
        }}
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
        color="primary"
      >
        <DownloadIcon />
      </Fab>
      <div role="region" aria-labelledby="caption" tabindex="0">
        <table>
          <thead>
            <tr>
              {headCells
                .filter((x) => !x.hide)
                .map((hc) => (
                  <th key={hc.id}>{hc.label}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headCells
                  .filter((x) => !x.hide)
                  .map((th, index) =>
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
      <Toolbar>
        <Typography>Registos por página:</Typography>&nbsp;&nbsp;
        <TextField
          onChange={(e) => {
            setPageSize(e.target.value);
          }}
          name="pageSize"
          select
          size="small"
          variant="standard"
          margin="dense"
          value={pageSize}
        >
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={250}>250</MenuItem>
          <MenuItem value={500}>500</MenuItem>
        </TextField>
        &nbsp;&nbsp; &nbsp;&nbsp;
        <Typography>
          pagina {pageNumber} de {pageCount}
        </Typography>
        &nbsp;&nbsp; &nbsp;&nbsp;
        <IconButton
          disabled={pageNumber <= 1}
          onClick={() => {
            setPageNumber(1);
          }}
          color="secondary"
        >
          <FirstPage />
        </IconButton>
        <IconButton
          disabled={pageNumber <= 1}
          onClick={() => {
            setPageNumber(Number.parseInt(pageNumber) - 1);
          }}
          color="secondary"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          disabled={pageNumber >= pageCount}
          onClick={() => {
            setPageNumber(Number.parseInt(pageNumber) + 1);
          }}
          color="secondary"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          disabled={pageNumber >= pageCount}
          onClick={() => {
            setPageNumber(pageCount);
          }}
          color="secondary"
        >
          <LastPage />
        </IconButton>
      </Toolbar>
    </>
  );
}
