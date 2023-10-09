import React from "react";
import { ErrorOutline, WarningOutlined } from "@mui/icons-material";

export default function TableComponent(props) {
  const { tableData, headCells, runValidations } = props;
  return (
    <div role="region" aria-labelledby="caption" tabindex="0">
      <table>
        <thead>
          <tr>
            {headCells
              .filter((x) => !x.hide)
              .map((hc) => (
                <th key={hc.id}>{hc.label}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tableData
            //.filter((rw) => validateDataValueSet(rw).length > 0)
            .map((row, rowIndex) => {
              const errors = runValidations(row, props.registosDuplicados);
              return (
                <tr
                  style={{
                    color: errors.length > 0 ? "red" : "black",
                  }}
                  key={rowIndex}
                >
                  {headCells
                    .filter((x) => !x.hide)
                    .map((th, index) => {
                      const erro = errors.filter((x) => x.ids.includes(th.id));
                      return (
                        <td key={index}>
                          {erro.length > 0 && (
                            <span
                              title={erro.map((err) => err.message).join(", ")}
                            >
                              {erro
                                .map((j) => j.errorType)
                                .includes("error") ? (
                                <ErrorOutline
                                  style={{ width: "15px", color: "#f00" }}
                                />
                              ) : (
                                <WarningOutlined
                                  style={{ width: "15px", color: "orange" }}
                                />
                              )}
                            </span>
                          )}
                          {Boolean(th.render) ? th.render(row) : row[th.id]}
                        </td>
                      );
                    })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
