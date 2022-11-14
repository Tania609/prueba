import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
const HeaderExport = ({cols, entidad}) => {
    const [filters1, setFilters1] = useState(null);
const [globalFilterValue1, setGlobalFilterValue1] = useState("");
    
    
    const exportColumns = cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
    }));
    
    const saveAsExcelFile = (buffer, fileName) => {
        import("file-saver").then((FileSaver) => {
            let EXCEL_TYPE ="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
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
            saveAsExcelFile(excelBuffer, "empleados");
        });
    };
    //Exportar a PDF
    const exportPDF = () => {
        import("jspdf").then((jsPDF) => {
                import("jspdf-autotable").then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, entidad);
                doc.save("EmpleadosZRX.pdf");
            });
        });
    };
    //FIN variables para exportar a PDF y Excel
    //INICIO BUSCADOR Global
    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1["global"].value = value;
        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };
    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }, //filtro Global
            //titulo: { value: null, matchMode: FilterMatchMode.IN },
        });
        setGlobalFilterValue1("");
    };
    //Se llama a esta funcion cada que se hace click en el boton limpiar
    const clearFilter1 = () => {
        initFilters1();
    };

    return (
        <div>
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
                    <InputText //InputText para busqueda global
                        value={globalFilterValue1}
                        onChange={onGlobalFilterChange1} // A cada cambio del valor del input llamará a la
                        function
                        placeholder="Buscar"
                    />
                </span>
                {/* Botones para exportar a excel y PDF */}
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
        </div>
    )
}

export default HeaderExport