import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Checkbox,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import requests from "./requests";
import Analitcs2Excel from "./Analitcs2Excel";
import TableComponentAnalitcsStyle from "./TableComponentAnalitcsStyle";
/*
import TableComponennt from "./TableComponennt";
import DeleteEnrolments from "./DeleteEnrolments";
*/
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";

let programs = [];
let orgUnitLevels = [];
let orgUnits = [];

function App() {
  const [updateDOM, setUpdateDOM] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedProgramStage, setSelectedProgramStage] = useState(null);
  const [seletcedDataElement, setSeletcedDataElement] = useState(null);
  const [selectedDataElements, setSelectedDataElements] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [selectedOrgUnitLevel, setSelectedOrgUnitLevel] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [loadData, setLoadData] = useState(false);
  const [downloadXLSX, setdownloadXLSX] = useState(false);
  const [selectedProgramIndicators, setSelectedProgramIndicators] = useState([]);
  const [selectedOrganizationUnit, setSelectedOrganizationUnit] =
    useState(null);

  async function init() {
    const [requestPrograms, requestOrgUnitLevels] = await Promise.all([
      requests.getPrograms(
        `?fields=id,displayName,trackedEntityType[id],programIndicators[id,name],programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName]],programStages[id,displayName,programStageDataElements[dataElement[id,displayName,formName]]]&filter=programType:eq:WITHOUT_REGISTRATION&paging=false`
      ),
      requests.getOrgUnitLevels(),
    ]);
    programs = requestPrograms.data.programs;
    orgUnitLevels = requestOrgUnitLevels.data.organisationUnitLevels;
    setUpdateDOM(!updateDOM);
  }

  async function getOrgUnits() {
    if (selectedOrgUnitLevel === null) return;
    const requestOrgUnits = await Promise.resolve(
      requests.getMyOrgUnitsByLevel(selectedOrgUnitLevel.level)
    );
    orgUnits = requestOrgUnits.data.organisationUnits;
    setUpdateDOM(!updateDOM);
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    getOrgUnits();
  }, [selectedOrgUnitLevel]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display={"flex"}>
          <Box style={{ maxWidth: "350px", minWidth: "350px" }}>
            <Box
              style={{
                flexDirection: "column",
                justifyContent: "center",
                padding: "10px",
              }}
              display={"flex"}
            >
              <Box
                style={{
                  maxHeight: "calc(100vh - 74px)",
                  minHeight: "calc(100vh - 74px)",
                  overflow: "auto",
                }}
              >
                <Autocomplete
                  options={orgUnitLevels}
                  onChange={(e, v) => {
                    setSelectedOrgUnitLevel(v);
                  }}
                  getOptionLabel={(option) => option.displayName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      size="small"
                      variant="outlined"
                      label="Nivel da unidade organizacional"
                    />
                  )}
                />
                <Autocomplete
                  options={orgUnits}
                  onChange={(e, v) => {
                    setSelectedOrganizationUnit(v);
                  }}
                  multiple disableCloseOnSelect
                  disabled={selectedOrgUnitLevel === null}
                  getOptionLabel={(option) => option.displayName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      size="small"
                      variant="outlined"
                      label="Unidade organizacional"
                    />
                  )}
                />

                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    onChange={(newValue) => setStartDate(dayjs(newValue))}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "dense",
                        size: "small",
                      },
                    }}
                    value={dayjs(startDate)}
                    label="Inicio"
                  />
                </DemoContainer>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "dense",
                        size: "small",
                      },
                    }}
                    onChange={(newValue) => setEndDate(dayjs(newValue))}
                    value={dayjs(endDate)}
                    label="Termino"
                  />
                </DemoContainer>

                <Autocomplete
                  options={programs}
                  onChange={(e, v) => {
                    setSelectedProgram(v);
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
                  options={
                    selectedProgram !== null
                      ? selectedProgram.programStages
                      : []
                  }
                  onChange={(e, v) => {
                    setSelectedProgramStage(v);
                  }}
                  disabled={selectedProgram === null}
                  getOptionLabel={(option) => option.displayName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      size="small"
                      variant="outlined"
                      label="Estagio"
                    />
                  )}
                />

                <Autocomplete
                  options={
                    selectedProgram !== null
                      ? selectedProgram.programTrackedEntityAttributes
                      : []
                  }
                  onChange={(e, v) => {
                    setSelectedAttributes(v);
                  }}
                  multiple
                  disabled={selectedProgram === null}
                  getOptionLabel={(option) =>
                    option.trackedEntityAttribute.displayName
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      size="small"
                      variant="outlined"
                      label="Attributos da Entidade Rastreada"
                    />
                  )}
                />

                <Autocomplete
                  options={
                    selectedProgramStage !== null
                      ? selectedProgramStage.programStageDataElements
                      : []
                  }
                  onChange={(e, v) => {
                    setSelectedDataElements(v);
                    //console.log(v);
                  }}
                  multiple disableCloseOnSelect
                  value={selectedDataElements}
                  name="dataElements"
                  id="dataElements"
                  disabled={selectedProgram === null}
                  getOptionLabel={(option) => option.dataElement.displayName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      size="small"
                      variant="outlined"
                      label="Elementos de Dado"
                    />
                  )}
                />
                <Autocomplete
                  options={
                    selectedProgram !== null
                      ? selectedProgram.programIndicators
                      : []
                  }
                  onChange={(e, v) => {
                    setSelectedProgramIndicators(v);
                    //console.log(v);
                  }}
                  multiple disableCloseOnSelect
                  value={selectedProgramIndicators}
                  name="programIndicators"
                  id="programIndicators"
                  disabled={selectedProgram === null}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      size="small"
                      variant="outlined"
                      label="Indicadores"
                    />
                  )}
                />

                {/*
                <List>
                  <ListItem disablePadding>
                    <ListItemText primary="Seleccione as colunas" />
                  </ListItem>
                  {selectedProgram === null
                    ? []
                    : selectedProgram.programTrackedEntityAttributes.map(
                        (tea, index) => (
                          <ListItem disablePadding key={index}>
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                //checked={checked.indexOf(value) !== -1}
                                value={tea}
                                //onChange={() => {}}
                                tabIndex={-1}
                                disableRipple
                                //inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </ListItemIcon>
                            <ListItemText>
                              {tea.trackedEntityAttribute.displayName}
                            </ListItemText>
                          </ListItem>
                        )
                      )}
                </List>
                */}
              </Box>
              <Box>
                <Button
                  style={{ width: "100%", marginTop: "15px" }}
                  variant="contained"
                  onClick={() => {
                    setLoadData(!loadData);
                  }}
                >
                  Carregar
                </Button>
                {/*
                &nbsp;
                <Button
                  style={{ width: "31%", marginTop: "15px" }}
                  variant="contained"
                  onClick={() => {
                    setdownloadXLSX(!downloadXLSX);
                  }}
                >
                  <DownloadIcon /> XLSX
                </Button>&nbsp;
                <Button
                  style={{ width: "31%", marginTop: "15px" }}
                  variant="contained"
                  onClick={() => {
                    setLoadData(!loadData);
                  }}
                >
                  <UploadIcon />
                  XLSX
                </Button>*/}
              </Box>
            </Box>
          </Box>
          <Box style={{ maxHeight: "100vh", overflow: "auto" }} flexGrow={1}>
            <Analitcs2Excel
              dataElement={seletcedDataElement}
              dataElements={selectedDataElements}
              orgUnits={selectedOrganizationUnit}
              program={selectedProgram}
              programStage={selectedProgramStage}
              programIndicators={selectedProgramIndicators}
              todosAttributos={
                selectedProgram !== null
                  ? selectedProgram.programTrackedEntityAttributes
                  : []
              }
              attributes={selectedAttributes}
              startDate={dayjs(startDate).format("YYYY-MM-DD")}
              endDate={dayjs(endDate).format("YYYY-MM-DD")}
              downloadXLSXFile={downloadXLSX}
              refresh={loadData}
            />
          </Box>
        </Box>
      </LocalizationProvider>
    </>
  );
}

export default App;