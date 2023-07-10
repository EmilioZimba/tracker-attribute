import React, { useEffect, useState } from "react";
import {
  Fab,
  Box,
  CircularProgress,
  Checkbox,
  Button,
  TextField,
  IconButton,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import requests from "./requests";
import dayjs from "dayjs";
import Export, { downloadXLSX, uploadExcel } from "./exportTable";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";

let tableData = [];

let selectedEnrolments = [];

export default function DeleteEnrolments({
  startDate,
  endDate,
  program,
  orgUnit,
  refresh,
  downloadXLSXFile,
}) {
  const [selectedEnrolments, setSelectedEnrolments] = useState([]);
  const [open, setOpen] = React.useState(false);

  const [headCells, setHeadCells] = useState([
    { id: "enrollment", label: "ID de Registo", hide: false },
    { id: "trackedEntityType", label: "Tipo de Entidade", hide: false },
    { id: "created", label: "Ceated At", hide: false },
    { id: "orgUnitName", label: "Unidade Organizacional", hide: false },
    { id: "enrollmentDate", label: "Enrollment Date", hide: false },
    {
      id: "trackedEntityInstance",
      label: "ID da Entidade Rastreada",
      hide: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  async function loadData() {
    setIsLoading(true);
    setSelectedEnrolments([]);
    const requestEnolments = await Promise.resolve(
      requests.getEnrollments(
        `.json?ou=${orgUnit.id}&program=${program.id}&paging=false`
      )
    );

    tableData = requestEnolments.data.enrollments.filter((x) => {
      return (
        new Date(x.enrollmentDate) >= new Date(startDate) &&
        new Date(x.enrollmentDate) <= new Date(endDate)
      );
    });

    setIsLoading(false);
  }

  async function handleDeleteSelectedEnrolments() {
    setOpen(false);
    try {
      setIsLoading(true);
      await Promise.all(
        selectedEnrolments.map((x) => requests.deleteEnrollments(`/${x}`))
      );
      loadData();
      setSnackbarMessage("Enrolments Deleted.");
      setOpen(true);
      setSelectedEnrolments([]);
    } catch (error) {
      setSnackbarMessage("Ocorreu um erro!");
      setOpen(true);
    }
    setIsLoading(false);
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    loadData();
  }, [refresh]);

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

  return (
    <>
      <Fab
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
        color="secondary"
        aria-label="edit"
        disabled={selectedEnrolments.length < 1}
        onClick={() => {
          setSnackbarMessage("Deseja eliminar esses dados?")
          setOpen(true);
        }}
      >
        <DeleteIcon />
      </Fab>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
        action={action}
      />
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
          {/* <Export
                fileName={program.displayName}
                tableData={tableData}
                colls={headCells}
              /> */}
        </Box>
      </Box>
      <div role="region" aria-labelledby="caption" tabindex="0">
        {isLoading && <LinearProgress />}
        <table>
          <thead>
            <tr>
              <th>
                <Checkbox
                  size="small"
                  style={{ width: "20px", padding: 0 }}
                  checked={selectedEnrolments.length === tableData.length}
                  onChange={() => {
                    if (selectedEnrolments.length !== tableData.length) {
                      setSelectedEnrolments(
                        tableData.map((x) => x["enrollment"])
                      );
                    } else {
                      setSelectedEnrolments([]);
                    }
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </th>
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
                <th style={{ maxWidth: "28px" }}>
                  <Checkbox
                    size="small"
                    style={{ width: "20px", padding: 0 }}
                    checked={selectedEnrolments.includes(row["enrollment"])}
                    onChange={() => {
                      if (selectedEnrolments.includes(row["enrollment"])) {
                        setSelectedEnrolments(
                          selectedEnrolments.filter(
                            (item) => item !== row["enrollment"]
                          )
                        );
                      } else {
                        setSelectedEnrolments([
                          ...selectedEnrolments,
                          row["enrollment"],
                        ]);
                      }
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </th>
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
    </>
  );
}
