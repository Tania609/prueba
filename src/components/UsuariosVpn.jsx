import React, { useState, useEffect } from "react";
import axios from "axios";

import HeaderExport from './HeaderExport';
const UsuariosVpn = () => {
    const [list, setList] = useState([]);
    useEffect(() => {
        axios({
          url: "https://jsonplaceholder.typicode.com/posts",
        })
          .then((response) => {
            setList(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, [setList]);
    const cols = [
        { field: "userId", header: "userId" },
        { field: "title", header: "Oficina" },
        { field: "body", header: "Nombres" }
    ];
    console.table(list);
    return (
        <div>
            <HeaderExport cols={cols} entidad={list}></HeaderExport>
            
        </div>
    )
}

export default UsuariosVpn