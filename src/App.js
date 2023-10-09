import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  DialogContentText,
  ButtonGroup,
  Typography,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import requests from "./requests";
import { generateWeeks } from "./utils";
import VBG from "./vbg/VBG";
import ATHIV from "./athiv/ATHIV";
import OrgUnitTree from "./components/OrgUnitTree";
import { Refresh, PivotTableChart, Download } from "@mui/icons-material";

let programs = [];

function App() {
  const [updateDOM, setUpdateDOM] = useState(false);
  const [generatePivot, setGeneratePivot] = useState(0);
  const [downloadData, setDownloadData] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [seletcedDataElement, setSeletcedDataElement] = useState(null);
  const [showSideBar, setShowSideBar] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [loadData, setLoadData] = useState(false);

  const singleSelect = true;
  const [orgUnitID, setOrgUnitID] = useState([]);
  const [level, setLevel] = useState("");
  const [ouRoots, setOuRoots] = useState([]);

  async function init() {
    const [requestPrograms] = await Promise.all([
      requests.getPrograms(
        `?fields=id,displayName,trackedEntityType[id],programIndicators[id,name],programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName]],programStages[id,displayName,programStageDataElements[sortOrder,dataElement[id,displayName,formName]]]&filter=id:in:[jCBlAOhHc1f,LKIneB0oGJa]&paging=false`
      ),
    ]);
    programs = requestPrograms.data.programs;
    setUpdateDOM(!updateDOM);
  }

  function handleCheckOrgUnitID(chkd, targetNode) {
    if (singleSelect) {
      setOrgUnitID([targetNode.value]);
    } else {
      setOrgUnitID(chkd);
    }
  }

  useEffect(() => {
    init();
  }, []);

  function renderDataTable() {
    if (selectedProgram === null) {
      return (
        <Box style={{ paddingTop: "200px", textAlign: "center" }}>
          <DialogContentText>
            Seleccione os campos para processar!
          </DialogContentText>
        </Box>
      );
    } else {
      if (selectedProgram.id === "jCBlAOhHc1f") {
        return (
          <VBG
            dataElement={seletcedDataElement}
            generatePivot={generatePivot}
            downloadData={downloadData}
            dataElements={
              selectedProgram != null
                ? selectedProgram.programStages[0].programStageDataElements.map(
                    (pde) => ({
                      ...pde.dataElement,
                      sortOrder: pde.sortOrder,
                    })
                  )
                : []
            }
            orgUnits={[{ id: orgUnitID }]}
            programIndicators={
              selectedProgram != null ? selectedProgram.programIndicators : []
            }
            program={selectedProgram}
            programStage={
              selectedProgram != null ? selectedProgram.programStages[0] : {}
            }
            todosAttributos={
              selectedProgram !== null
                ? selectedProgram.programTrackedEntityAttributes
                : []
            }
            attributes={selectedAttributes}
            startDate={dayjs(startDate).format("YYYY-MM-DD")}
            endDate={dayjs(endDate).format("YYYY-MM-DD")}
            refresh={loadData}
          />
        );
      }
      if (selectedProgram.id === "LKIneB0oGJa") {
        return (
          <ATHIV
            dataElement={seletcedDataElement}
            generatePivot={generatePivot}
            downloadData={downloadData}
            dataElements={
              selectedProgram != null
                ? selectedProgram.programStages[0].programStageDataElements.map(
                    (pde) => ({
                      ...pde.dataElement,
                      sortOrder: pde.sortOrder,
                    })
                  )
                : []
            }
            orgUnits={[{ id: orgUnitID }]}
            programIndicators={
              selectedProgram != null ? selectedProgram.programIndicators : []
            }
            program={selectedProgram}
            programStage={
              selectedProgram != null ? selectedProgram.programStages[0] : {}
            }
            todosAttributos={
              selectedProgram !== null
                ? selectedProgram.programTrackedEntityAttributes
                : []
            }
            attributes={selectedAttributes}
            startDate={dayjs(startDate).format("YYYY-MM-DD")}
            endDate={dayjs(endDate).format("YYYY-MM-DD")}
            refresh={loadData}
          />
        );
      }
    }
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <IconButton
          color="secondary"
          style={{
            position: "fixed",
            transition: "all .3s",
            marginLeft: showSideBar ? "295px" : "0px",
            bottom: "14px",
            zIndex: 100,
          }}
          onClick={() => setShowSideBar(!showSideBar)}
        >
          {showSideBar ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
        <Box display={"flex"}>
          <Box
            style={{
              marginLeft: !showSideBar ? "-300px" : "0px",
              minWidth: "300px",
              width: "300px",
              transition: "all .3s",
              borderRight: "1px solid #eee",
            }}
          >
            <Box
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "5px",
                flexDirection: "column",
                height: "calc(100vh - 150px)",
                minHeight: "calc(100vh - 40px)",
                maxHeight: "calc(100vh - 40px)",
              }}
            >
              <Box flexGrow={1}>
                <Autocomplete
                  options={programs}
                  //style={{ width: "380px" }}
                  onChange={(e, v) => {
                    setSelectedProgram(v);
                    setGeneratePivot(0);
                    setDownloadData(0);
                  }}
                  getOptionLabel={(option) => option.displayName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      size="small"
                      variant="outlined"
                      label="Programa"
                    />
                  )}
                />
                <Autocomplete
                  options={[
                    "Semanal",
                    "Mensal",
                    "Trimestral",
                    "Semestral",
                    "Anual",
                  ]}
                  onChange={(e, v) => {
                    //setSelectedProgram(v);
                  }}
                  //getOptionLabel={(option) => option.displayName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      size="small"
                      variant="outlined"
                      label="Tipo de periodo"
                    />
                  )}
                />
                <Autocomplete
                  options={generateWeeks("2023-01-02", "2023-12-31", 16)}
                  onChange={(e, v) => {
                    setStartDate(v[0].startDate);
                    setEndDate(v[0].endDate);
                  }}
                  getOptionLabel={(opt) => {
                    return `WK${opt[0].weekNumber} ${dayjs(
                      opt[0].startDate
                    ).format("DDMM")}-${dayjs(opt[0].endDate).format("DDMM")}`;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      size="small"
                      variant="outlined"
                      label="Periodo"
                    />
                  )}
                />

                <Box style={{ textAlign: "center" }}>
                  <Typography variant="button">
                    Seleccione a unidade organizacional
                  </Typography>
                </Box>
                <OrgUnitTree
                  orgUnitLevel={level}
                  orgUnitLevels={level}
                  loadTableData={() => {}}
                  setOURoots={(ouroots) => setOuRoots(ouroots)}
                  handleCheck={handleCheckOrgUnitID}
                  orgUnitIDs={orgUnitID}
                />
              </Box>

              <Box style={{ textAlign: "center", width: "100%" }}>
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                >
                  <Button
                    onClick={() => {
                      setLoadData(!loadData);
                    }}
                  >
                    <Refresh />
                  </Button>
                  <Button
                    onClick={() => {
                      setGeneratePivot((current) => current + 1);
                    }}
                  >
                    Pivot &nbsp;
                    <PivotTableChart />
                  </Button>
                  <Button
                    onClick={() => {
                      setDownloadData((current) => current + 1);
                    }}
                  >
                    <Download />
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
          </Box>
          <Box
            style={{
              transition: "all .3s",
              padding: 0,
              margin: 0,
              overflow: "auto",
              height: "100vh",
              boxShadow: "none",
            }}
            flexGrow={1}
          >
            <Box style={{ height: "100vh", overflow: "auto" }} flexGrow={1}>
              {renderDataTable()}
            </Box>
          </Box>
        </Box>
      </LocalizationProvider>
    </>
  );
}

export default App;
