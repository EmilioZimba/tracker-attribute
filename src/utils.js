import requests from "./requests";

export function generateWeeks(startDate, endDate, weeknumber) {
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  let weeks = [];
  let currentWeek = [];
  let weekNbr = weeknumber;

  //startDate=2021-09-01&endDate=2023-09-13

  while (startDate <= endDate) {
    currentWeek.push({
      startDate: new Date(startDate),
      endDate: new Date(startDate.setDate(startDate.getDate() + 6)),
      weekNumber: weekNbr,
    });

    if (startDate.getDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    startDate.setDate(startDate.getDate() + 1);
    weekNbr = weekNbr + 1;
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

export async function initializeOrgUnitsTree(
  orgUnitID = null,
  showParents = false
) {
  const levels = await Promise.resolve(requests.getMyOrgUnits());

  let userRoots = []; //roots orgUnits
  let lvls = [];
  if (Boolean(orgUnitID)) {
    if (orgUnitID.length > 0) {
      const ouRoot = await Promise.resolve(requests.getOrgUnitsByID(orgUnitID));
      userRoots = [orgUnitID];
      lvls = [ouRoot.data.level];
    }
  } else {
    lvls = levels.data.organisationUnits.map((x) => {
      userRoots.push(x.id);
      return x.level;
    });
  }

  if (lvls[0] !== null) {
    const [ouLevels, orgUnits, unwrapedorgunits] = await Promise.all([
      requests.getOrganisationUnitLevels(lvls[0]),
      requests.getOrgUnitsByIDs(userRoots),
      requests.getOrgUnits(),
    ]);

    let niveis = ouLevels.data.organisationUnitLevels;
    niveis.sort(function (a, b) {
      return a.nivel - b.nivel;
    });
    let newOus = [];
    if (showParents) {
      newOus = unwrapedorgunits.data.organisationUnits.map((x) => {
        if (x.hasOwnProperty("parent")) {
          if (x.parent.hasOwnProperty("parent")) {
            x.province = x.parent.parent.displayName;
            x.district = x.parent.displayName;
            //x.displayName = x.parent.parent.displayName + ' - ' + x.parent.displayName + ' - ' + x.displayName;
          } else {
            x.province = x.parent.displayName;
          }
          x.lastUpdated =
            x.lastUpdated.toString().substr(0, 10) +
            " " +
            x.lastUpdated.toString().substr(11, 8);
        }
        return x;
      });
    } else {
      newOus = unwrapedorgunits.data.organisationUnits.map((x) => {
        if (x.hasOwnProperty("parent")) {
          if (x.parent.hasOwnProperty("parent")) {
            x.displayName =
              x.parent.parent.displayName +
              " - " +
              x.parent.displayName +
              " - " +
              x.displayName;
          } else {
            x.displayName = x.parent.displayName + " - " + x.displayName;
          }
          x.lastUpdated =
            x.lastUpdated.toString().substr(0, 10) +
            " " +
            x.lastUpdated.toString().substr(11, 8);
        }
        return x;
      });
    }

    return {
      orgUnitLevels: niveis,
      orgUnitTree: orgUnits.data.organisationUnits,
      expandedNodes: userRoots,
      unwrapedorgunits: newOus,
    };
  }
}
