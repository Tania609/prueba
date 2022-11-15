import React from 'react'
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

const FilterLogic = (estados,text) => {
    const estadoItemTemplate = (option) => {
        return <span className={`empleado-badge estado-${option}`}>{option}</span>;
    };

    const estadoFilterTemplate = (options) => {
        return (
          <Dropdown
            value={options.value}
            options={estados}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            itemTemplate={estadoItemTemplate}
            placeholder={"'"+text+"'"}
            className="p-column-filter"
            showClear
          />
        );
    };
    const oficinaItemTemplate = (option) => {
        return <span className="image-text">{option}</span>;
    };
    
    const oficinaFilterTemplate = (options) => {
        //console.table(options.value);
        return (
          <MultiSelect
            value={options.value}
            options={estados}
            onChange={(e) => options.filterCallback(e.value)}
            itemTemplate={oficinaItemTemplate}
            placeholder={"'"+text+"'"}
            className="p-column-filter"
            showClear
          />
        );
    };

    const filtersMap = {
        filters1: { value: filters1, callback: setFilters1 },
    };
    
    const onGlobalFilterChange1 = (event, filtersKey) => {
        const value = event.target.value;
        let filters = { ...filtersMap[filtersKey].value };
        filters["global"].value = value;
    
        filtersMap[filtersKey].callback(filters);
    };
    
      //Uncion para limpiar los filtros
    const clearFilter1 = () => {
        setFilters1(""); //Agregamos el valor VACIO a la variable SetFilter para vaciar el filtro
    };

      
    return (
        [estadoFilterTemplate,oficinaFilterTemplate,onGlobalFilterChange1,clearFilter1]
    )

}

export default FilterLogic