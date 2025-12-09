import React from "react";
import Productos from "./Productos";
import "../components/estilos/ListaProductos.css";
import { useCarrito } from "../contex/CarritoContexto";
//import { useAdmin } from "../contex/AdminContex";


const ListaProductos = () => {

const { productos } = useCarrito()
  
  return (
    
      <div className="galleryContainer">
        {productos.map((producto) => {
          return <Productos producto={producto} />;
        })}
      </div>
    
  );
};

export default ListaProductos;
