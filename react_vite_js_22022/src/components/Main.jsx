import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../contex/CarritoContexto';
import Swal from 'sweetalert2';

const Main = () => {
  const { productos } = useCarrito();
 

  // Seleccionamos un producto destacado (podría venir de una API o ser el primero)
  const productoDestacado = productos.length > 0 ? productos[7] : null;

  if (!productoDestacado) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg my-8">
        <p className="text-gray-500">No hay productos destacados disponibles</p>
      </div>
    );
  }

  const funcionalidadPendiente = () => {
    Swal.fire({
      title: "Funcionalidad pendiente",
      text: "Esta característica estará disponible pronto",
      icon: "info",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  };
  

    return (
    <section className="relative max-w-6xl mx-auto my-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-xl overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Contenedor de texto */}
          <div className="md:w-1/2 p-6 text-white z-10">
            <span className="inline-block bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-medium mb-4">
              Destacado de la semana
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{productoDestacado.nombre}</h2>
            
            {/* Lista sutil de características */}
            <ul className="mb-6 space-y-2 text-gray-300">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Código: {productoDestacado.codigo}
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Disponibles: {productoDestacado.cantidad} unidades
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Envío gratis en compras mayores a $100
              </li>
            </ul>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-amber-400 mr-4">${productoDestacado.precio}</span>
              {productoDestacado.precioOriginal && (
                <span className="text-lg text-gray-400 line-through">${productoDestacado.precioOriginal}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                 onClick={()=>funcionalidadPendiente()}//onClick={() => handleAgregarCarrito(productoDestacado)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Añadir al carrito
              </button>

              <Link
                to={`/productos/${productoDestacado.id}`}
                className="px-5 py-2 bg-transparent border border-amber-400 text-amber-400 font-medium rounded-lg hover:bg-amber-400 hover:text-black transition-colors duration-300"
              >
                Ver detalles
              </Link>
            </div>
          </div>

          {/* Contenedor de imagen */}
          <div className="md:w-1/2 relative">
            <div className="relative h-64 md:h-96 w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent z-10" />
              <img
                src={productoDestacado.imagen}
                alt={productoDestacado.nombre}
                className="absolute right-0 h-full w-auto object-cover object-center transition-all duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

};

export default Main;


