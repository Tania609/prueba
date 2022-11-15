import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";

const HeaderExport = (entidad, filtersKey) => {
    const []
    const filters = filtersMap[`${filtersKey}`].value;

    const value = filters["global"] ? filters["global"].value : "";

    const exportColumns = cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
    }));
    
    const saveAsExcelFile = (buffer, fileName) => {
        import("file-saver").then((FileSaver) => {
          let EXCEL_TYPE =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
          let EXCEL_EXTENSION = ".xlsx";
          const data = new Blob([buffer], {
            type: EXCEL_TYPE,
          });
          FileSaver.saveAs(
            data,
            fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
          );
        });
    };
    
      //Exportar a Excel
    const exportExcel = () => {
        import("xlsx").then((xlsx) => {
          const workSheet = xlsx.utils.json_to_sheet(entidad);
          const workBook = { Sheets: { data: workSheet }, SheetNames: ["data"] };
          const excelBuffer = xlsx.write(workBook, {
            bookType: "xlsx",
            type: "array",
          });
          saveAsExcelFile(excelBuffer, '"'+entidad+'"');
        });
    };
    
      //Exportar a PDF
    const exportPDF = () => {
        import("jspdf").then((jsPDF) => {
          import("jspdf-autotable").then(() => {
            const doc = new jsPDF.default(0, 0);
            doc.autoTable(exportColumns, entidad);
            doc.save('"'+entidad+'"ZRX.pdf"');
          });
        });
    };
    return (
        <div className="flex justify-content-between">
        <Button //Boton para limpiar la busqueda del textbox global
          type="button"
          icon="pi pi-filter-slash"
          label="Limpiar"
          className="p-button-outlined"
          onClick={clearFilter1}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            value={value || ""}
            onChange={(e) => onGlobalFilterChange1(e, filtersKey)}
            placeholder="Global Search"
          />
        </span>
        <div className="flex align-items-center export-button">
          <Button
            type="button"
            icon="pi pi-file-excel"
            onClick={exportExcel}
            className="p-button-success mr-2"
            data-pr-tooltip="XLS"
          />
          <Button
            type="button"
            icon="pi pi-file-pdf"
            onClick={exportPDF}
            className="p-button-warning mr-2"
            data-pr-tooltip="PDF"
          />
        </div>
      </div>
    )
}

export default HeaderExport