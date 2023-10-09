import React, { useEffect, useState } from "react";
import {
  Fab,
  Box,
  CircularProgress,
  TextField,
  Dialog,
  DialogContentText,
  IconButton,
  Button,
  Link,
  Toolbar,
  Typography,
  MenuItem,
  Snackbar,
} from "@mui/material";
import requests from "../requests";
import DownloadIcon from "@mui/icons-material/Download";
import "./vbg.css";
import { downloadXLSX } from "../components/exportTable";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  FirstPage,
} from "@mui/icons-material";
import tableDataPivot from "./pivot";
import tableMap from "./tableMap";
import runValidations, { duplicates } from "./errors";
import TableComponent from "../components/tableComponent";

let tableData = [];
let orgUnitsFramed = {};
let registosDuplicados = [];

function generatePivotTable() {
  for (let i = 0; i < tableData.length; i++) {
    let row = tableData[i];
    let piKey = null;
    let provinceKey = null;

    if (orgUnitsFramed[row["ou"]].path.split("/")[2] !== "z2HuWcyEU18") {
      if (runValidations(row, registosDuplicados).length <= 0) {
        if (
          row["ouname"].includes("Estabelecimento") ||
          row["ouname"].includes("Escola")
        ) {
          piKey = "SERNAP";
        } else {
          piKey = row["ouname"].split(".")[0];
        }
        provinceKey = orgUnitsFramed[row["ou"]].path.split("/")[2];
        const tipoRastreio = row["de_XNRJPcjqgGr"];

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].rastreados =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].rastreados +
          1;

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].veconomica =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].veconomica +
          (row["de_XNRJPcjqgGr"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].vsexual =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].vsexual +
          (row["pi_vtQJk9qTLPe"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].vpsicologica =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].vpsicologica +
          (row["pi_mldOO49REgB"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].vfisica =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].vfisica +
          (row["pi_gssQI9ZpwUB"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].positivos =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].positivos +
          (row["pi_nIvgH253IDE"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].prm =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].prm +
          (row["de_DEwuMVne5OY"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].ipaj =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].ipaj +
          (row["de_VIVLD6MPd4z"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].apoiosocial =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].apoiosocial +
          (row["de_onYTFbzwqfh"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].ppe =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].ppe +
          (row["de_anzEIWo2yyl"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].its =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].its +
          (row["de_ZPQsuVvll2t"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].hiv =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].hiv +
          (row["de_NJMktFK6QHZ"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].ce =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].ce +
          (row["de_TobTikW6GEu"].includes("1") ? 1 : 0);

        tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].us =
          tableDataPivot[provinceKey]["pis"][piKey][tipoRastreio].us +
          (row["de_haO8lhazCUK"] !== "" ? 1 : 0);
      }
    }
  }
}

export default function ViolenciaBaseadaNoGenero(props) {
  const {
    startDate,
    endDate,
    program,
    programStage,
    dataElements,
    programIndicators,
    orgUnit,
    orgUnits,
    refresh,
    downloadData,
    generatePivot,
  } = props;
  const [headCells, setHeadCells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noDataToLoad, setNoDataToLoad] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(500);
  const [pageNumber, setPageNumber] = useState(1);
  const [open, setOpen] = React.useState(false);
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
      ...tableMap,
    };

    const [requestAnalitcsEvents, requestFramedOrgUnits] = await Promise.all([
      requests.getAnalyticsEvents(
        `${program.id}.json?dimension=ou:${orgUnits
          .map((x) => x.id)
          .join(";")}&startDate=${startDate}&endDate=${endDate}&stage=${
          programStage.id
        }&outputType=EVENT&${dataElements
          .map((de) => `dimension=${programStage.id}.${de.id}`)
          .join("&")}&${programIndicators
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
      if (
        requestFramedOrgUnits.data.organisationUnits[i].id !== "z2HuWcyEU18"
      ) {
        orgUnitsFramed[requestFramedOrgUnits.data.organisationUnits[i].id] =
          requestFramedOrgUnits.data.organisationUnits[i];
      }
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

      if (headCellsAux[`pi_${h.name}`] !== undefined) {
        headCellsAux[`pi_${h.name}`].index = index;
      }
    });

    requestAnalitcsEvents.data.rows.forEach((h, index) => {
      let row = {};
      Object.values(headCellsAux).forEach((hc, j) => {
        row[hc.id] = h[hc.index];
      });
      tableData.push(row);
    });

    registosDuplicados = duplicates(tableData);
    setHeadCells(Object.values(headCellsAux));
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

  useEffect(() => {
    if (downloadData !== 0) {
      downloadXLSX(
        "ATHIV__" + pageNumber + " of " + pageCount,
        headCells,
        tableData
      );
    }
  }, [downloadData]);

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
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

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
                  <th colSpan={2}>Rastreados</th>
                  <th colSpan={2}>Positivos</th>
                  <th colSpan={2}>V. Sexual</th>
                  <th colSpan={2}>V. Psicologica</th>
                  <th colSpan={2}>V. Fisisca</th>
                  <th colSpan={2}>V. Economica</th>
                  <th colSpan={2}>APSS</th>
                  <th colSpan={2}>CE</th>
                  <th colSpan={2}>PRM</th>
                  <th colSpan={2}>IPAJ</th>
                  <th colSpan={2}>PPE</th>
                  <th colSpan={2}>HIV</th>
                  <th colSpan={2}>US</th>
                </tr>
                <tr>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
                  <th>VBG</th>
                  <th>VPI</th>
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
                        <td>{Object.values(prov.pis)[0]["vbg"].rastreados}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].rastreados}</td>
                        <td>{Object.values(prov.pis)[0]["vbg"].positivos}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].positivos}</td>
                        <td>{Object.values(prov.pis)[0]["vbg"].vsexual}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].vsexual}</td>
                        <td>
                          {Object.values(prov.pis)[0]["vbg"].vpsicologica}
                        </td>
                        <td>
                          {Object.values(prov.pis)[0]["vpi"].vpsicologica}
                        </td>
                        <td>{Object.values(prov.pis)[0]["vbg"].vfisica}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].vfisica}</td>
                        <td>{Object.values(prov.pis)[0]["vbg"].veconomica}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].veconomica}</td>

                        <td>{Object.values(prov.pis)[0]["vbg"].apoiosocial}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].apoiosocial}</td>

                        <td>{Object.values(prov.pis)[0]["vbg"].ce}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].ce}</td>

                        <td>{Object.values(prov.pis)[0]["vbg"].prm}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].prm}</td>

                        <td>{Object.values(prov.pis)[0]["vbg"].ipaj}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].ipaj}</td>

                        <td>{Object.values(prov.pis)[0]["vbg"].ppe}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].ppe}</td>

                        <td>{Object.values(prov.pis)[0]["vbg"].hiv}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].hiv}</td>

                        <td>{Object.values(prov.pis)[0]["vbg"].us}</td>
                        <td>{Object.values(prov.pis)[0]["vpi"].us}</td>
                      </tr>
                      {Object.keys(prov.pis)
                        .slice(1)
                        .map((pi) => (
                          <tr>
                            <td>{pi}</td>
                            <td>{prov.pis[pi]["vbg"].rastreados}</td>
                            <td>{prov.pis[pi]["vpi"].rastreados}</td>
                            <td>{prov.pis[pi]["vbg"].positivos}</td>
                            <td>{prov.pis[pi]["vpi"].positivos}</td>
                            <td>{prov.pis[pi]["vbg"].vsexual}</td>
                            <td>{prov.pis[pi]["vpi"].vsexual}</td>
                            <td>{prov.pis[pi]["vbg"].vpsicologica}</td>
                            <td>{prov.pis[pi]["vpi"].vpsicologica}</td>
                            <td>{prov.pis[pi]["vbg"].vfisica}</td>
                            <td>{prov.pis[pi]["vpi"].vfisica}</td>
                            <td>{prov.pis[pi]["vbg"].veconomica}</td>
                            <td>{prov.pis[pi]["vpi"].veconomica}</td>

                            <td>{prov.pis[pi]["vbg"].apoiosocial}</td>
                            <td>{prov.pis[pi]["vpi"].apoiosocial}</td>

                            <td>{prov.pis[pi]["vbg"].ce}</td>
                            <td>{prov.pis[pi]["vpi"].ce}</td>

                            <td>{prov.pis[pi]["vbg"].prm}</td>
                            <td>{prov.pis[pi]["vpi"].prm}</td>

                            <td>{prov.pis[pi]["vbg"].ipaj}</td>
                            <td>{prov.pis[pi]["vpi"].ipaj}</td>

                            <td>{prov.pis[pi]["vbg"].ppe}</td>
                            <td>{prov.pis[pi]["vpi"].ppe}</td>

                            <td>{prov.pis[pi]["vbg"].hiv}</td>
                            <td>{prov.pis[pi]["vpi"].hiv}</td>

                            <td>{prov.pis[pi]["vbg"].us}</td>
                            <td>{prov.pis[pi]["vpi"].us}</td>
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
