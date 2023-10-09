//TODO: populate more validation errors
function runValidations(row, tableData) {
  let errorList = [];

  if (row["de_XNRJPcjqgGr"] === "") {
    errorList.push({
      message: "Tipo de rstreio não especificado",
      ids: ["de_XNRJPcjqgGr"],
      errorType: "error",
    });
  }
  if (row["de_rey0Vhsno3B"] === "") {
    errorList.push({
      message: "Codigo Unico não especificado",
      ids: ["de_rey0Vhsno3B"],
      errorType: "error",
    });
  }
  if (row["de_ZXPPkHzOCrd"] === "" && row["pi_nIvgH253IDE"].includes("1")) {
    errorList.push({
      message: "Carrege o guia de referencia",
      ids: ["de_ZXPPkHzOCrd"],
      errorType: "warning",
    });
    //console.log(errorList);
  }

  if (tableData.includes(row["de_rey0Vhsno3B"])) {
    errorList.push({
      message: "codigo unico duplicado",
      ids: ["de_rey0Vhsno3B"],
      errorType: "error",
    });
  }

  return errorList;
}

export function duplicates(tableData) {
  let codigosUnicos = tableData.map((x) => x["de_rey0Vhsno3B"]);
  let findDuplicates = (arr) =>
    arr.filter((item, index) => arr.indexOf(item) !== index);

  return findDuplicates(codigosUnicos);
  //  console.log([...new Set(findDuplicates(codigosUnicos))]); // Unique duplicates
}

export default runValidations;
