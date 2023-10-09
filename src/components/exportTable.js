import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Download, FileExcel, FileDelimited } from "mdi-material-ui";
import { saveAs } from "file-saver";
import Excel from "exceljs";
import { parse_zip, read, stream, write, writeFile } from "xlsx";

export default function Export(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  return (
    <>
      <Tooltip title="Transferir">
        <IconButton
          size="small"
          aria-controls="simple-menu"
          aria-haspopup="true"
          variant="contained"
          onClick={handleClick}
        >
          <Download />
        </IconButton>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            downloadXLSX(props.fileName, props.colls, props.tableData);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <FileExcel />
          </ListItemIcon>
          <Typography variant="inherit">Excel</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            downloadCSV(props.fileName, props.colls, props.tableData);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <FileDelimited />
          </ListItemIcon>
          <Typography variant="inherit">CSV</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export function printUsingExcelJS(fileName, colls, tableData) {
  let workbook = new Excel.Workbook();
  let sheet = workbook.addWorksheet(fileName);
  sheet.columns = colls
    .filter((x) => x.id !== "k")
    .map((x) => {
      if (x.editable) {
        return {
          header: x.label,
          key: x.id,
          width: 25,
        };
      } else {
        return {
          header: x.label,
          key: x.id,
          width: 15,
        };
      }
    });

  tableData.map((row) => {
    const rowData = {};
    colls
      .filter((x) => x.id !== "k")
      .map((coll) => {
        if (coll.isFormula) {
          if (coll.numeric) {
            rowData[coll.id] = Number(eval(coll.formula));
          } else {
            rowData[coll.id] = eval(coll.formula);
          }
        } else if (coll.numeric) {
          if (!!row[coll.id]) {
            rowData[coll.id] =
              coll.id.split(".").length > 1
                ? Number(row[coll.id.split(".")[0]][coll.id.split(".")[1]])
                : Number(row[coll.id]);
          }
        } else {
          rowData[coll.id] =
            coll.id.split(".").length > 1
              ? row[coll.id.split(".")[0]][coll.id.split(".")[1]]
              : row[coll.id];
        }
      });
    sheet.addRow(rowData);
  });

  sheet.eachRow(function (row, rowNumber) {});

  sheet.getRow(1).font = {
    bold: true,
  };

  return workbook;
}

export function downloadXLSX(fileName, colls, tableData) {
  printUsingExcelJS(fileName, colls, tableData)
    .xlsx.writeBuffer()
    .then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `${fileName}_exp_${new Date().getTime()}.xlsx`
      );
    });
}

export function downloadCSV(fileName, colls, tableData) {
  printUsingExcelJS(fileName, colls, tableData)
    .csv.writeBuffer()
    .then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/text" }),
        `${fileName}_export_${new Date().getTime()}.xlsx`
      );
    });
}

export function uploadExcel(excelFile) {
  const reader = new FileReader();

  reader.readAsArrayBuffer(excelFile);
  reader.onloadend = () => {
    //sheetNames = [];
    const bstr = reader.result;
    const wb = read(bstr, { type: "binary" });
    //sheetNames = wb.SheetNames;
    //setShowExcelModal(true);
  };
}
