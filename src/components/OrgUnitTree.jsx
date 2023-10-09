import React, { useEffect, useState } from "react";
import { initializeOrgUnitsTree } from "../utils";
import "./react-checkbox-tree.css";
import CheckboxTree from "react-checkbox-tree";
import { CircularProgress, Box } from "@mui/material";

function OrgUnitTree(props) {
  const [expanded, setExpanded] = useState([]);
  const [nodes, setNodes] = useState([]);

  async function init() {
    const initializeOrgUnits = await Promise.resolve(initializeOrgUnitsTree());
    setNodes(initializeOrgUnits.orgUnitTree);
    setExpanded(initializeOrgUnits.expandedNodes);
    props.setOURoots(initializeOrgUnits.expandedNodes);
  }

  useEffect(() => {
    init();
  }, []);

  function handleReloadTableData(ouid = null) {
    props.loadTableData(ouid);
  }

  return nodes.length > 0 ? (
    <>
      <Box
        style={{
          maxHeight: "calc(100vh - 325px)",
          paddingLeft: "10px",
          overflowY: "auto",
        }}
      >
        <CheckboxTree
          nodes={nodes}
          checked={props.orgUnitIDs}
          expanded={expanded}
          noCascade={true}
          onCheck={(chkd, targetNode) => {
            props.handleCheck(chkd, targetNode);
            //handleReloadTableData([targetNode.value], props.orgUnitLevel);
            handleReloadTableData([targetNode.value]);
          }}
          onExpand={(expd) => setExpanded(expd)}
        />
      </Box>
    </>
  ) : (
    <div style={{ padding: "50px 5px", textAlign: "center" }}>
      <CircularProgress />
    </div>
  );
}

export default OrgUnitTree;
