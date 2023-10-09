import React, { useState, useEffect } from "react";
import tableDataPivot from "./pivot";
import {
  Fab,
  Box,
  CircularProgress,
  TextField,
  Dialog,
  DialogContentText,
  IconButton,
  Link,
  Toolbar,
  Typography,
  MenuItem,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  Download,
  FirstPage,
} from "@mui/icons-material";
import Export, { downloadXLSX, uploadExcel } from "../components/exportTable";
import tableMap from "./tableMap";
import requests from "../requests";
import runValidations, { duplicates } from "./errors";
import TableComponent from "../components/tableComponent";

let tableData = [];
let registosDuplicados = [];
let orgUnitsFramed = {};

function generatePivotTable() {
  for (let i = 0; i < tableData.length; i++) {
    let row = tableData[i];
    let piKey = null;
    let provinceKey = null;

    if (orgUnitsFramed[row["ou"]].path.split("/")[2] !== "z2HuWcyEU18") {
      if (runValidations(row).length <= 0) {
        if (
          row["ouname"].includes("Estabelecimento") ||
          row["ouname"].includes("Escola")
        ) {
          piKey = "SERNAP";
        } else {
          piKey = row["ouname"].split(".")[0];
        }
        provinceKey = orgUnitsFramed[row["ou"]].path.split("/")[2];

        tableDataPivot[provinceKey]["pis"][piKey].kitsDistribuidos =
          tableDataPivot[provinceKey]["pis"][piKey].kitsDistribuidos + 1;

        if (row["de_upeg33LfQGu"] === "secundaria") {
          tableDataPivot[provinceKey]["pis"][piKey].secundaria =
            tableDataPivot[provinceKey]["pis"][piKey].secundaria + 1;
        }
        if (row["de_upeg33LfQGu"] === "primaria") {
          tableDataPivot[provinceKey]["pis"][piKey].primaria =
            tableDataPivot[provinceKey]["pis"][piKey].primaria + 1;
        }
        if (row["de_JStTXchDRKc"] === "assistida") {
          tableDataPivot[provinceKey]["pis"][piKey].assistida =
            tableDataPivot[provinceKey]["pis"][piKey].assistida + 1;
        } else {
          tableDataPivot[provinceKey]["pis"][piKey].naoAssistida =
            tableDataPivot[provinceKey]["pis"][piKey].naoAssistida + 1;
        }
      }
    }
  }
}

export default function ATHIV({
  startDate,
  endDate,
  program,
  programStage,
  dataElements,
  orgUnit,
  orgUnits,
  refresh,
  downloadXLSXFile,
  generatePivot,
}) {
  const [headCells, setHeadCells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noDataToLoad, setNoDataToLoad] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(500);
  const [pageNumber, setPageNumber] = useState(1);
  const [showPivot, setShowPivot] = useState(false);

  async function loadData() {
    if (program === null || dataElements.length <= 0) return;

    setNoDataToLoad(false);
    setIsLoading(true);
    let headCellsAux = {
      psi: {
        id: "psi",
        label: "Event",
        hide: false,
        index: 0,
        render: (row) => (
          <Link
            href={`https://dhis2-passos.fhi360.org/dhis-web-capture/index.html#/viewEvent/${row["psi"]}`}
            target="_blank"
          >
            mostrar
          </Link>
        ),
      },
      pi: { id: "eventdate", label: "EventDate", hide: true, index: 2 },
      ouname: { id: "ouname", label: "OrgUnitName", hide: false, index: 6 },
      ou: { id: "ou", label: "OU", hide: true, index: 8 },
    };

    dataElements.forEach((de) => {
      headCellsAux[`de_${de.id}`] = {
        id: `de_${de.id}`,
        label: Boolean(de.formName) ? de.formName : de.displayName,
        hide: false,
      };
    });

    //outputType = EVENT | ENROLLMENT | TRACKED_ENTITY_INSTANCE

    const [requestAnalitcsEvents, requestFramedOrgUnits] = await Promise.all([
      requests.getAnalyticsEvents(
        `${program.id}.json?dimension=ou:${orgUnits
          .map((x) => x.id)
          .join(";")}&startDate=${startDate}&endDate=${endDate}&stage=${
          programStage.id
        }&outputType=EVENT&${dataElements
          .map((de) => `dimension=${programStage.id}.${de.id}`)
          .join(
            "&"
          )}&pageSize=${pageSize}&page=${pageNumber}&_=${new Date().getTime()}&_=${new Date().getTime()}`
      ),
      requests.getOrgUnitCostumRequest(
        `?fields=id,name,displayName,level,path&paging=false`
      ),
    ]);

    for (
      let i = 0;
      i < requestFramedOrgUnits.data.organisationUnits.length;
      i++
    ) {
      orgUnitsFramed[requestFramedOrgUnits.data.organisationUnits[i].id] =
        requestFramedOrgUnits.data.organisationUnits[i];
    }

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

    generatePivotTable();
    setIsLoading(false);
    setNoDataToLoad(false);
  }

  useEffect(() => {
    loadData();
  }, [refresh, pageNumber, pageSize]);

  useEffect(() => {
    if (generatePivot !== 0) setShowPivot(true);
  }, [generatePivot]);

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
          downloadXLSX(
            "ATHIV WK " +
              program.displayName +
              "__" +
              pageNumber +
              " of " +
              pageCount,
            headCells,
            tableData
          );
        }}
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
        color="primary"
      >
        <Download />
      </Fab>

      <TableComponent
        pageNumber={pageNumber}
        pageSize={pageSize}
        headCells={headCells}
        registosDuplicados={registosDuplicados}
        tableData={tableData}
        runValidations={runValidations}
      />

      <Toolbar>
        <Typography>Registos por página:</Typography>&nbsp;&nbsp;
        <TextField
          onChange={(e) => {
            setPageSize(e.target.value);
          }}
          InputProps={{ disableUnderline: true }}
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
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={showPivot}
        onClose={() => {
          setShowPivot(false);
        }}
      >
        <>
          <div role="region" aria-labelledby="caption" tabindex="0">
            <table>
              <thead>
                <tr>
                  <th rowSpan={2}>Provincia</th>
                  <th rowSpan={2}>PI</th>
                  <th colSpan={2}>Tipo de Distribuição</th>
                  <th colSpan={2}>Tipo de Testagem</th>
                  <th rowSpan={2}>Total de Kits</th>
                </tr>
                <tr>
                  <th>Assistida</th>
                  <th>Não Assistida</th>
                  <th>Primaria</th>
                  <th>Secundaria</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(tableDataPivot).map((prov) => {
                  return (
                    <>
                      <tr>
                        <td rowSpan={Object.keys(prov.pis).length}>
                          {prov.displayName}
                        </td>
                        <td>{Object.keys(prov.pis)[0]}</td>
                        <td>{Object.values(prov.pis)[0].assistida}</td>
                        <td>{Object.values(prov.pis)[0].naoAssistida}</td>
                        <td>{Object.values(prov.pis)[0].primaria}</td>
                        <td>{Object.values(prov.pis)[0].secundaria}</td>
                        <td>{Object.values(prov.pis)[0].kitsDistribuidos}</td>
                      </tr>
                      {Object.keys(prov.pis)
                        .slice(1)
                        .map((pi) => (
                          <tr>
                            <td>{pi}</td>
                            <td>{prov.pis[pi].assistida}</td>
                            <td>{prov.pis[pi].naoAssistida}</td>
                            <td>{prov.pis[pi].primaria}</td>
                            <td>{prov.pis[pi].secundaria}</td>
                            <td>{prov.pis[pi].kitsDistribuidos}</td>
                          </tr>
                        ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      </Dialog>
    </>
  );
}
