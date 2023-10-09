function runValidations(row) {
  let errorList = [];
  if (row["de_upeg33LfQGu"] === "") {
    errorList.push({
      message: "Tipo de distribuição não especificado",
      ids: ["de_upeg33LfQGu"],
      errorType: "error",
    });
  }
  if (row["de_JStTXchDRKc"] === "") {
    errorList.push({
      message: "Tipo de Autotestagem não especificado",
      ids: ["de_JStTXchDRKc"],
      errorType: "error",
    });
  }
  if (
    row["de_upeg33LfQGu"] === "secundaria" &&
    row["de_JStTXchDRKc"] === "assistida"
  ) {
    errorList.push({
      message:
        "a distribuição não pode ser secundaria e a auto-testagem ser assistida",
      ids: ["de_JStTXchDRKc", "de_upeg33LfQGu"],
      errorType: "error",
    });
    //console.log(errorList);
  }

  if (row["de_JfMWAmQEHop"] === "" && row["de_upeg33LfQGu"] === "primaria") {
    errorList.push({
      message: "a distribuição não pode ser primaria com o sexo desconhecido",
      ids: ["de_JfMWAmQEHop", "de_upeg33LfQGu"],
      errorType: "error",
    });
    //console.log(errorList);
  }

  return errorList;
}

export default runValidations;
