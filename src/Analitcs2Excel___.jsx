import React, { useEffect, useState } from "react";
import {
  Fab,
  Box,
  CircularProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton,
  Button,
  Checkbox,
  Toolbar,
  Typography,
  MenuItem,
  Snackbar,
} from "@mui/material";
import requests from "./requests";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import "./table_no_fixed_columns.css";
import Export, { downloadXLSX, uploadExcel } from "./components/exportTable";
import PivotTableChartIcon from "@mui/icons-material/PivotTableChart";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  FirstPage,
} from "@mui/icons-material";



/*
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

*/

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
  const [noDataToLoad, setNoDataToLoad] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(500);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedEnrolments, setSelectedEnrolments] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [showPivot, setShowPivot] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  
  function transferirEventos() {}
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  async function handleDeleteSelectedEnrolments() {
    setOpen(false);
    try {
      setIsLoading(true);
      await Promise.all(selectedEnrolments.map((x) => requests.deleteEvent(x)));
      loadData();
      setSnackbarMessage("Event Deleted.");
      setOpen(true);
      setSelectedEnrolments([]);
    } catch (error) {
      setSnackbarMessage("Ocorreu um erro!");
      setOpen(true);
    }
    setIsLoading(false);
  }

  const action = (
    <React.Fragment>
      <Button
        color="secondary"
        size="small"
        onClick={handleDeleteSelectedEnrolments}
      >
        Confirmar
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  if (noDataToLoad)
    return (
      <Box style={{ paddingTop: "200px", textAlign: "center" }}>
        <DialogContentText>
          Seleccione os campos para processar!
        </DialogContentText>
      </Box>
    );

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
          setShowPivot(true);
        }}
        style={{ position: "fixed", bottom: "20px", right: "81px" }}
        color="secundary"
      >
        <PivotTableChartIcon />
      </Fab>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
        action={action}
      />
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
            {tableData
              //.filter((rw) => validateDataValueSet(rw).length > 0)
              .map((row, rowIndex) => (
                <tr
                  style={{
                    color:
                      validateDataValueSet(row).length > 0 ? "red" : "black",
                  }}
                  key={rowIndex}
                >
                  {headCells
                    .filter((x) => !x.hide)
                    .map((th, index) => (
                      <td key={index}>
                        {Boolean(th.render) ? th.render(row) : row[th.id]}
                        {/*row[th.id]*/}
                      </td>
                    ))}
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
