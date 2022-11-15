import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";

import { Toast } from "primereact/toast";

const DataTableComponent = () => {
  //Hooks useState La función setEmpleados se usa para actualizar el estado. Acepta un nuevo valor de estado y sitúa en la cola una nueva renderización del componente.
  const [empleados, setEmpleados] = useState([]);
  const toast = useRef(null);
  const [oficinasCombo, setOficinasCombo] = useState([]);

  //const [globalFilterValue1, setGlobalFilterValue1] = useState(""); //valor del input text de busqueda global

  //Se recupera los datos del empleado a través de AXIOS
  //INICIO useEffect
  useEffect(() => {
    axios
      .post("http://172.20.106.186:8088/desa/bd/crud_uti.php", {
        opcion: 1,
      })
      .then((response) => setEmpleados(response.data));

    axios
      .post("http://172.20.106.186:8088/desa/bd/crud_uti.php", {
        opcion: 8,
      })
      .then((response) => setOficinasCombo(response.data));
      
  }, []);
  //FIN useEffect

  //INICIO chips/badge estado de empleado
  const estadoBodyTemplate = (rowData) => {
    return (
      <span
        className={`empleado-badge estado-${rowData.desc_estd.toLowerCase()}`}
      >
        {rowData.desc_estd}
      </span>
    );
  };
  //FIN chips/badge estado de empleado

  const estados = ["activo", "inactivo"];
  const oficinas = [
    "CUSCO MANCO INCA",
    "CUSCO RPV",
    "ABANCAY",
    "SICUANI",
    "ESPINAR",
    "MADRE DE DIOS",
  ];
  //console.log(oficinas);

  

  //INICIO variables para exportar a PDF y Excel
  const cols = [
    { field: "id_empl", header: "userId" },
    { field: "desc_ofic", header: "Oficina" },
    { field: "nomb_empl", header: "Nombres" },
    { field: "ape_pate_empl", header: "Ap. Paterno" },
    { field: "ape_mate_empl", header: "Ap. Materno" },
    { field: "dni_empl", header: "DNI" },
    { field: "sexo_empl", header: "Sexo" },
    { field: "desc_area", header: "Area" },
    { field: "desc_estd", header: "Estado" },
  ];

  
  //FIN variables para exportar a PDF y Excel

  const [filters1, setFilters1] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }, //filtro Global
    desc_estd: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    desc_ofic: { value: null, matchMode: FilterMatchMode.IN },
  });

  //INICIO BUSCADOR Global
  

  const renderHeader1 = (filtersKey) => {
    //console.log(filtersKey);
    

    return (
      
    );
  };
  const header1 = renderHeader1("filters1"); //encabezado para agregar boton Limpiar y buscador
  //Fin BUSCADOR Global
  let emptyEmpleado = {
    id_empl: null,
  };

  const [empleado, setEmpleado] = useState(emptyEmpleado);
  const [empleadoDialog, setEmpleadoDialog] = useState(false);
  const [deleteEmpleadoDialog, setDeleteEmpleadoDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const hideDialog = () => {
    setSubmitted(false);
    setEmpleadoDialog(false);
  };
  const editEmpleado = (empleado) => {
    setEmpleado({ ...empleado });
    setEmpleadoDialog(true);
  };
  const confirmDeleteEmpleado = (empleado) => {
    setEmpleado(empleado);
    setDeleteEmpleadoDialog(true);
  };

  const findIndexById = (id_empl) => {
    //console.log(empleados.length);
    let index = -1;
    for (let i = 0; i < empleados.length; i++) {
      if (empleados[i].id_empl === id_empl) {
        index = i;
        break;
      }
    }

    return index;
  };

  const saveEmpleado = () => {
    setSubmitted(true);
    console.log(empleado.desc_ofic);
    if (empleado.id_empl.trim()) {
      let _empleados = [...empleados];
      let _empleado = { ...empleado };
      if (empleado.id_empl) {
        const index = findIndexById(empleado.id_empl);
        _empleados[index] = _empleado;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Empleado Actualizado",
          life: 3000,
        });

        axios
          .post("http://172.20.106.186:8088/desa/bd/crud_uti.php", {
            opcion: 3,
            id_empl: empleado.id_empl,
            nomb_empl: empleado.nomb_empl.trim(),
            ape_pate_empl: empleado.ape_pate_empl.trim(),
            ape_mate_empl: empleado.ape_mate_empl.trim(),
            dni_empl: empleado.dni_empl.trim(),
            sexo_empl: empleado.sexo_empl.trim(),
            id_vinc_labo: empleado.id_vinc_labo,
            id_perf: empleado.id_perf,
            id_ofic: empleado.id_ofic,
            id_area: empleado.id_area,
            fech_inic_empl: empleado.fech_inic_empl,
            fech_fin_empl: empleado.fech_fin_empl,
            id_estd: empleado.id_estd,
            obsv_empl: empleado.obsv_empl,
          })
          .then((response) => {});
      } else {
        // _product.id = createId();
        // _product.image = 'product-placeholder.svg';
        // _products.push(_product);
        // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }

      setEmpleados(_empleados);
      setEmpleadoDialog(false);
      setEmpleado(emptyEmpleado);
    }
  };
  const onInputChange = (e, name) => {
    //console.log(name);
    const val = (e.target && e.target.value) || "";
    let _empleado = { ...empleado };
    _empleado[`${name}`] = val;
    //console.log(_empleado);
    setEmpleado(_empleado);
  };

  const onMultiSelectChange = (e, name) => {
    //console.log(name);
    const val = (e.target && e.target.value) || "";
    let _empleado = { ...empleado };
    _empleado[`${name}`] = val;

    let selectedOficina=oficinasCombo.filter(element => element.desc_ofic===val);
    //console.log(selectedOficina['0']['id_ofic']);
    _empleado[`id_ofic`] =selectedOficina['0']['id_ofic'];
    setEmpleado(_empleado);
  };

  const empleadoDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveEmpleado}
      />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editEmpleado(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteEmpleado(rowData)}
        />
      </React.Fragment>
    );
  };

  //INICIO DE LO QUE VA A DEVOLVER EL COMPONENTE
  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <DataTable
          value={empleados}
          responsiveLayout="scroll"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          dataKey="id_empl"
          paginator
          showGridlines //Si se van a mostrar líneas de cuadrícula entre celdas.
          emptyMessage="No se encontraron resultados"
          className="datatable-responsive"
          currentPageReportTemplate="Mostrando {first} de {last} de un total de {totalRecords} registros"
          rows={20} //Numero de columnas que se mostrará
          header={header1} //llama a la funcion header1
          filterDisplay="menu"
          filters={filters1}
          onFilter={(e) => setFilters1(e.filters)}
          size="small" //tamaño del alto de las filas puede ser: SMALL/LARGE, si no se detalla esta en estado normal
          //globalFilterFields={["empleados.desc_ofic", "empleados.desc_estd"]}, si se detalla esto, ya no funcionara la busqueda global
        >
          <Column field="id_empl" sortable header="ID"></Column>
          <Column
            field="desc_ofic"
            header="Oficina"
            filter
            filterField="desc_ofic"
            filterElement={oficinaFilterTemplate}
            filterMenuStyle={{ width: "14rem" }}
            showFilterMatchModes={false}
            style={{ minWidth: "14rem" }}
            sortable
          ></Column>
          <Column field="nomb_empl" sortable header="Nombres"></Column>
          <Column field="ape_pate_empl" sortable header="Ap. Paterno"></Column>
          <Column field="ape_mate_empl" sortable header="Ap. Materno"></Column>
          <Column field="dni_empl" sortable header="DNI"></Column>
          <Column field="sexo_empl" sortable header="Sexo"></Column>
          <Column field="desc_area" sortable header="Area"></Column>
          <Column
            field="desc_estd"
            sortable
            header="Estado"
            body={estadoBodyTemplate}
            filter
            filterElement={estadoFilterTemplate}
            filterMenuStyle={{ width: "14rem" }}
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false} //Para quitar el boton de mas reglas
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={empleadoDialog}
        style={{ width: "450px" }}
        header="Detalle Empleado"
        modal
        className="p-fluid"
        footer={empleadoDialogFooter}
        onHide={hideDialog}
      >
        {empleado.nomb_empl && (
          <img
            src={`images/product/${empleado.nomb_empl}`}
            onError={(e) =>
              (e.target.src =
                "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
            }
            alt={empleado.nomb_empl}
            className="product-image block m-auto pb-3"
          />
        )}
        <div className="field">
          <label htmlFor="oficina">Oficina</label>
          {/* <InputText
            id="oficina"
            value={empleado.desc_ofic || ""}
            onChange={(e) => onInputChange(e, "desc_ofic")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !empleado.desc_ofic,
            })}
          /> */}
          <Dropdown id="oficina" options={oficinas} value={empleado.desc_ofic || ""} onChange={(e) => onMultiSelectChange(e, "desc_ofic")}/>
          {/* {submitted && !empleado.desc_ofic && (
            <small className="p-error">Name is required.</small>
          )} */}
        </div>
        <div className="field">
          <label htmlFor="nombres">Nombres</label>
          <InputText
            id="nombres"
            value={empleado.nomb_empl || ""}
            onChange={(e) => onInputChange(e, "nomb_empl")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !empleado.nomb_empl,
            })}
          />
          {submitted && !empleado.nomb_empl && (
            <small className="p-error">Name is required.</small>
          )}
        </div>


        <div className="field">
        <div className="formgrid grid">
        <div className="field col">
          <label htmlFor="apePaterno">Ap. Paterno</label>
          <InputText
            id="apePaterno"
            value={empleado.ape_pate_empl || ""}
            onChange={(e) => onInputChange(e, "ape_pate_empl")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !empleado.ape_pate_empl,
            })}
          />
          {submitted && !empleado.ape_pate_empl && (
            <small className="p-error">Ap. Paterno is required.</small>
          )}
        </div>

        <div className="field col">
            <label htmlFor="apeMaterno">Ap. Materno</label>
            <InputText
                id="apeMaterno"
                value={empleado.ape_mate_empl || ""}
                onChange={(e) => onInputChange(e, "ape_mate_empl")}
                required
                autoFocus
                className={classNames({
                "p-invalid": submitted && !empleado.ape_mate_empl,
                })}
            />
            {submitted && !empleado.ape_pate_empl && (
                <small className="p-error">Ap. Materno is required.</small>
            )}
          </div>
          </div>
        </div>



        <div className="field">
          <label htmlFor="dni">DNI</label>
          <InputText
            id="dni"
            value={empleado.dni_empl || ""}
            onChange={(e) => onInputChange(e, "dni_empl")}
            autoFocus
            className={classNames({
              "p-invalid": submitted && !empleado.dni_empl,
            })}
          />
          {submitted && !empleado.dni_empl && (
            <small className="p-error">DNI is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="area">Area</label>
          <InputText
            id="area"
            value={empleado.desc_area || ""}
            onChange={(e) => onInputChange(e, "desc_area")}
            autoFocus
            className={classNames({
              "p-invalid": submitted && !empleado.desc_area,
            })}
          />
          {submitted && !empleado.desc_area && (
            <small className="p-error">DNI is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="estado">Estado</label>
          <InputText
            id="estado"
            value={empleado.desc_estd || ""}
            onChange={(e) => onInputChange(e, "desc_estd")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !empleado.desc_estd,
            })}
          />
          {submitted && !empleado.desc_estd && (
            <small className="p-error">DNI is required.</small>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default DataTableComponent;
