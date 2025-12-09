import React, { useState } from "react";
import Boton from "./Boton";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../contex/CarritoContexto";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useUsuario } from "../contex/UsuarioContexto";

/**
 * Componente para mostrar un producto individual con funcionalidad de carrito
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.producto - Datos del producto a mostrar
 * @returns {JSX.Element} - Elemento JSX que representa el producto
 */
const Productos = ({ producto }) => {
  const navigate = useNavigate();
  const { handleAgregarCarrito } = useCarrito();
  const {usuario} = useUsuario()

  const [cantidad, setCantidad] = useState(0);
  const [stock, setStock] = useState(producto.cantidad);
  const [costoCompra, setCostoCompra] = useState(0);

  const incrementar = () => {
    if (stock > 0) {
      setCantidad((prev) => prev + 1);
      setStock((prev) => prev - 1);
      setCostoCompra((prev) => prev + producto.precio);
    }
  };

  const decrementar = () => {
    if (cantidad > 0) {
      setCantidad((prev) => prev - 1);
      setStock((prev) => prev + 1);
      setCostoCompra((prev) => prev - producto.precio);
    }
  };

  const agregarAlCarrito = () => {
    if (cantidad > 0) {
      handleAgregarCarrito(producto, cantidad);
      setCantidad(cantidad);
      setCostoCompra(costoCompra);
    }
  };

  return (
    <div className="galleryContainer">
      <div
        className="productCard relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group"
        key={producto.codigo}
      >
        {/* Imagen del producto */}
        {producto.imagen && (
          <div className="h-48 w-full overflow-hidden relative">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={producto.imagen}
              alt={producto.nombre}
              onClick={() => navigate(`/productos/${producto.id}`)}
            />
            <span className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              #{producto.codigo}
            </span>
          </div>
        )}

        {/* Contenido informativo */}
        <div className="p-4">
          {/* Nombre y precio */}
          <div className="flex justify-between items-start mb-2">
            <h3 
              className="text-lg font-semibold text-gray-900 truncate pr-2 hover:text-amber-600 transition-colors cursor-pointer"
              onClick={() => navigate(`/productos/${producto.id}`)}
            >
              {producto.nombre}
            </h3>
            <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
              ${producto.precio.toLocaleString()}
            </span>
            
            
          </div>
          <h1>{producto.descripcion}</h1>
          {/* Estado de stock */}
          <div className="mb-4">
            <p
              className={`text-xs font-medium py-1 px-2 rounded-full inline-flex items-center ${
                !stock
                  ? "bg-red-100 text-red-800"
                  : stock < 3
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {!stock
                ? "❌ Agotado"
                : stock < 15
                ? `⚠️ ${stock} disponibles`
                : `✔️ ${stock} disponibles`}
            </p>
          </div>

          {/* Controles de cantidad */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={decrementar}
                disabled={cantidad === 0}
                className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200 focus:outline-none ${
                  cantidad === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                }`}
              >
                <span className="text-lg">−</span>
              </button>

              {cantidad > 0 && (
                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 text-base font-bold text-gray-900">
                  {cantidad}
                </span>
              )}

              <button
                onClick={incrementar}
                disabled={stock === 0}
                className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200 focus:outline-none ${
                  stock === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                }`}
              >
                <span className="text-lg">+</span>
              </button>
            </div>

            {costoCompra > 0 && (
              <span className="text-sm font-semibold text-amber-600 ml-2">
                ${costoCompra.toFixed(2)}
              </span>
            )}
          </div>

          {/* Botón para agregar al carrito */}
          {cantidad > 0 && usuario && (
            <div className="mt-4">
              <button
                onClick={agregarAlCarrito}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Agregar al carrito
                <ShoppingCartIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productos;