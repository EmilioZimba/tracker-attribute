import axios from "axios";

//MUDE CONFORME AS SUAS CREDENCIAIS
const authetication = btoa("ezimba:H3rminio_91");

export function baseURL() {
  if (process.env.NODE_ENV === "production") {
    //return `${window.location.origin}/${window.location.pathname.toString().split('/')[1]}`;
    return `${window.location.origin}`;
  } else {
    //MUDE ISTO PARA A SUA INSTANCIA
    return "https://dhis2-passos.fhi360.org";
    //return 'http://localhost:8080';
    //return 'http://localhost:8080/2.34';
  }
}

export function getBaseURL() {
  return baseURL() + "/api/";
}

function getRequestHeaders() {
  if (process.env.NODE_ENV === "production") {
    return {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
  return {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Basic ${authetication}`,
      //'X-CSRFToken': getCookieValue('csrftoken'),
      //'Authorization': `Bearer ${getToken()}`,
    },
  };
}

const requests = {
  getPrograms: (q = ".json") =>
    axios.get(`${getBaseURL()}programs${q}`, getRequestHeaders()),
  getProgramStages: (q = ".json") =>
    axios.get(`${getBaseURL()}programStages${q}`, getRequestHeaders()),
  getTrackedEntityInstances: (q = ".json") =>
    axios.get(`${getBaseURL()}trackedEntityInstances${q}`, getRequestHeaders()),

  getOrgUnitCostumRequest: (q) =>
    axios.get(`${getBaseURL()}organisationUnits.json${q}`, getRequestHeaders()),

  getOrgUnits: () =>
    axios.get(
      `${getBaseURL()}organisationUnits.json?fields=id,code,lastUpdated,created,displayName,parent[displayName,parent[displayName]],level&paging=false&_=${new Date().getTime()}`,
      getRequestHeaders()
    ),
  getOrgUnitsByID: (orgUnitID) =>
    axios.get(
      `${getBaseURL()}/organisationUnits/${orgUnitID}.json?fields=*,organisationUnitGroups[id,displayName],parent[id,name,level]&paging=false`,
      getRequestHeaders()
    ),
  getOrgUnitLevels: () =>
    axios.get(
      `${getBaseURL()}organisationUnitLevels.json?fields=id,displayName,level&paging=false&_=${new Date().getTime()}&order=level:asc`,
      getRequestHeaders()
    ),
  getOrganisationUnitLevels: (level) =>
    axios.get(
      `${getBaseURL()}/organisationUnitLevels.json?fields=id,level~rename(nivel),displayName~rename(nome)&filter=level:gt:${level}&paging=false&_=${new Date().getTime()}`,
      getRequestHeaders()
    ),
  getDataElementGroups: () =>
    axios.get(
      `${getBaseURL()}dataElementGroups.json?fields=id, displayName&paging=false&order=displayName:asc&_=${new Date().getTime()}`,
      getRequestHeaders()
    ),
  getDataElements: () =>
    axios.get(
      `${getBaseURL()}dataElements.json?paging=false&fields=id,displayName,valueType,dataSetElements,categoryCombo[categoryOptionCombos[id,displayName]]&_=${new Date().getTime()}`,
      getRequestHeaders()
    ),
  getDataSets: (q = ``) =>
    axios.get(`${getBaseURL()}dataSets${q}`, getRequestHeaders()),
  getCategoryCombos: () =>
    axios.get(
      `${getBaseURL()}categoryCombos.json?paging=false&fields=id,displayName,categoryOptionCombos[id,displayName]&_=${new Date().getTime()}`,
      getRequestHeaders()
    ),
  getCategory: (uid) =>
    axios.get(
      `${getBaseURL()}categories/${uid}.json?fields=id,name,displayName,shortName,code,periodType,categoryCombo,dataSetElements[dataElement[id,name,categoryCombo[id,name,displayName,shortName]]]&_=${new Date().getTime()}`
    ),
  me: () => axios.get(`${getBaseURL()}/29/me.json?_=${new Date().getTime()}`),
  postDataValueSets: (data) =>
    axios.post(
      `${getBaseURL()}dataValueSets?_=${new Date().getTime()}`,
      data,
      getRequestHeaders()
    ),
  putDataElementMapping: (data) =>
    axios.put(
      `${getBaseURL()}dataStore/registosDiarioDistrital/dataElements?_=${new Date().getTime()}`,
      data,
      getRequestHeaders()
    ),
  getDataElementMapping: () =>
    axios.get(
      `${getBaseURL()}dataStore/registosDiarioDistrital/dataElements?_=${new Date().getTime()}`,
      getRequestHeaders()
    ),
  getNavegadores: (orgUnitID = ``) =>
    axios.get(
      `${getBaseURL()}dataStore/registosDiarioDistrital/navegadores_${orgUnitID}?_=${new Date().getTime()}`,
      getRequestHeaders()
    ),
  postNavegadores: (orgUnitID = ``, data) =>
    axios.post(
      `${getBaseURL()}dataStore/registosDiarioDistrital/navegadores_${orgUnitID}?_=${new Date().getTime()}`,
      data,
      getRequestHeaders()
    ),
  putNavegadores: (orgUnitID = ``, data) =>
    axios.put(
      `${getBaseURL()}dataStore/registosDiarioDistrital/navegadores_${orgUnitID}?_=${new Date().getTime()}`,
      data,
      getRequestHeaders()
    ),
  putOrgUnitMapping: (data) =>
    axios.put(
      `${getBaseURL()}dataStore/registosDiarioDistrital/orgunits?_=${new Date().getTime()}`,
      data,
      getRequestHeaders()
    ),
  getOrgUnitMapping: () =>
    axios.get(
      `${getBaseURL()}dataStore/registosDiarioDistrital/orgunits?_=${new Date().getTime()}`,
      getRequestHeaders()
    ),
  getConfigs: () =>
    axios.get(
      `${getBaseURL()}dataStore/registosDiarioDistrital/configs?_=${new Date().getTime()}`,
      getRequestHeaders()
    ),
  postConfigs: (data) =>
    axios.post(
      `${getBaseURL()}dataStore/registosDiarioDistrital/configs?_=${new Date().getTime()}`,
      data,
      getRequestHeaders()
    ),
  putConfigs: (data) =>
    axios.put(
      `${getBaseURL()}dataStore/registosDiarioDistrital/configs?_=${new Date().getTime()}`,
      data,
      getRequestHeaders()
    ),

  postEvents: (data) =>
    axios.post(`${getBaseURL()}events.json`, data, getRequestHeaders()),
  putEvents: (data, eventID) =>
    axios.put(`${getBaseURL()}events/${eventID}`, data, getRequestHeaders()),
  deleteEvent: (eventID) =>
    axios.delete(`${getBaseURL()}events/${eventID}`, getRequestHeaders()),
  getEvents: (program, orgUnit, startDate, endDate) =>
    axios.get(
      `${getBaseURL()}events.json?program=${program}&orgUnit=${orgUnit}&startDate=${startDate}&endDate=${endDate}&fields=trackedEntityInstance,event,eventDate,orgUnit,orgUnitName,status,dataValues[id,value,dataElement]&order=eventDate:desc&paging=false`,
      getRequestHeaders()
    ),
  login: () => axios.get(`${getBaseURL()}me.json`, getRequestHeaders()),

  getMyOrgUnits: () =>
    axios.get(
      `${getBaseURL()}me.json?fields=organisationUnits[id,level]&withinUserSearchHierarchy=true&_=${new Date().getTime()}`,
      getRequestHeaders()
    ),
  getEnrollments: (q = ``) =>
    axios.get(`${getBaseURL()}enrollments${q}`, getRequestHeaders()),
  deleteEnrollments: (q = ``) =>
    axios.delete(`${getBaseURL()}enrollments${q}`, getRequestHeaders()),
  getAnalyticsEvents: (q = ``) =>
    axios.get(
      `${getBaseURL()}29/analytics/events/query/${q}`,
      getRequestHeaders()
    ),
  getAnalyticsEnrollments: (q = ``) =>
    axios.get(
      `${getBaseURL()}analytics/enrollments/query/${q}`,
      getRequestHeaders()
    ),
  getMyOrgUnitsByLevel: (level = 1) =>
    axios.get(
      `${getBaseURL()}organisationUnits.json?fields=id,displayName,parent[displayName]&filter=level:eq:${level}&paging=false&withinUserSearchHierarchy=true&_=${new Date().getTime()}`,
      getRequestHeaders()
    ),

  getOrgUnitsByIDs: (orgUnitIDs) =>
    axios.get(
      `${getBaseURL()}organisationUnits.json?filter=id:in:[${orgUnitIDs.toString()}]&fields=id~rename(value),name~rename(label),level,children[id~rename(value),name~rename(label),level,children[id~rename(value),name~rename(label),level,children[id~rename(value),level,name~rename(label),children[id~rename(value),name~rename(label),level,children[id~rename(value),name~rename(label),level,children[id~rename(value),name~rename(label),children[id~rename(value),name~rename(label)]]]]]]]&paging=false`,
      getRequestHeaders()
    ),
  getOrgUnitsByUIDs: (orgUnitUIDs) =>
    axios.get(
      `${getBaseURL()}organisationUnits.json?paging=false&fields=id,level,parent[id,name],children[id,name,level,displayName,parent[id,name],children[id,name,displayName,level,parent[id,name],children[id,name,level,displayName,parent[id,name],children[id,name,level,displayName,parent[id,name,level]]]]]&includeDescendants:true&withinUserSearchHierarchy=true&filter=id:in:[${orgUnitUIDs.join(
        ","
      )}]`,
      getRequestHeaders()
    ),
  getUserOrgUnits: (lvl) =>
    axios.get(
      `${getBaseURL()}organisationUnits.json?filter=id:in:[${lvl.userRoots.toString()}]&fields=id~rename(value),name~rename(label),level,children[id~rename(value),name~rename(label),level,children[id~rename(value),name~rename(label),level,children[id~rename(value),level,name~rename(label),children[id~rename(value),name~rename(label),level,children[id~rename(value),name~rename(label),level,children[id~rename(value),name~rename(label),children[id~rename(value),name~rename(label)]]]]]]]&paging=false&_=${new Date().getTime()}`,
      getRequestHeaders()
    ),
};

export default requests;
