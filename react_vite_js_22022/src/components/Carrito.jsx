import React, {  } from "react";
import { XMarkIcon, ShoppingBagIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../contex/CarritoContexto";
import Swal from "sweetalert2";

const Carrito = ({ carritoItems }) => {
  //const [ resetCarrito, setResetCarrito ] = useState(0)
  const navigate = useNavigate();
  const { eliminarDelCarrito, actualizarCantidad, vaciarCarrito } = useCarrito();
  
  const importeCompra = carritoItems.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  const alertaCompraExitosa = () => {
  Swal.fire({
    title: "¡Compra registrada con éxito!",
    text: "Recibirás un correo con los detalles de tu pedido",
    icon: "success",
    iconColor: "#10B981", // Verde esmeralda
    confirmButtonColor: "#3B82F6", // Azul de Tailwind
    background: "#FFFFFF", // Fondo blanco
    backdrop: `
      rgba(16, 185, 129, 0.2) // Fondo semitransparente verde claro
      url("/images/confetti.gif") // Efecto de confeti opcional
      center top
      no-repeat
    `,
    timer:1500,
    timerProgressBar: true,
    showConfirmButton: false,
    position: "center",
    customClass: {
      title: 'text-xl font-bold text-gray-800',
      popup: 'rounded-lg shadow-xl border border-gray-200'
    }
  });
};
    

  const handlePagar = () => {
    // Crear objeto de compra para localStorage
    const compra = {
      fecha: new Date().toISOString(),
      productos: carritoItems,
      total: importeCompra,
      estado: "pendiente"
      
    };
    alertaCompraExitosa()
    
    // Guardar en localStorage
    localStorage.setItem('compra', JSON.stringify(compra));
    

    vaciarCarrito();
    // Redirigir (puedes cambiar esto según tu flujo)
    navigate("/compras");
    
  };
  

  const incrementarCantidad = (id) => {
    const producto = carritoItems.find(item => item.id === id);
    actualizarCantidad(id, producto.cantidad + 1);
  };

  const decrementarCantidad = (id) => {
    const producto = carritoItems.find(item => item.id === id);
    if (producto.cantidad > 1) {
      actualizarCantidad(id, producto.cantidad - 1);
    } else {
      eliminarDelCarrito(id);
    }
  };



return (
    <div className="fixed inset-0 z-50 bg-white flex justify-center items-center">
      <div className="w-full max-w-2xl h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] flex flex-col shadow-xl mx-2 sm:mx-4 md:mx-6">
        {/* Header del modal */}
        <div className="p-3 sm:p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Tu Carrito</h2>
          <button
            onClick={() => navigate("/productos")}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6">
          {carritoItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-8 sm:py-12">
              <ShoppingBagIcon className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-gray-300 mb-4 sm:mb-6" />
              <p className="text-gray-500 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-center px-4">Tu carrito está vacío</p>
              <button
                onClick={() => navigate("/productos")}
                className="px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 py-3 sm:py-4">
              {carritoItems.filter(item => item.cantidad > 0).map((item) => (
                <li key={item.id} className="py-4 sm:py-6 flex">
                  {/* Imagen del producto */}
                  <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md overflow-hidden bg-gray-100">
                    {item.imagen ? (
                      <img 
                        src={item.imagen} 
                        alt={item.nombre} 
                        className="w-full h-full object-cover hover:opacity-90 cursor-pointer"
                        onClick={() => navigate(`/productos/${item.id}`)}
                      />
                    ) : (
                      <ShoppingBagIcon className="w-full h-full text-gray-400 p-2 sm:p-3" />
                    )}
                  </div>

                  {/* Detalles del producto */}
                  <div className="ml-3 sm:ml-4 flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <h3 
                        className="text-sm sm:text-base md:text-lg font-medium text-gray-900 hover:text-indigo-600 cursor-pointer line-clamp-1"
                        onClick={() => navigate(`/productos/${item.id}`)}
                      >
                        {item.nombre}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-green-600 ml-2">
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">${item.precio.toFixed(2)} c/u</p>
                    
                    {/* Controles de cantidad */}
                    <div className="flex items-center mt-2 sm:mt-3">
                      <button 
                        onClick={() => decrementarCantidad(item.id)}
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-100 rounded-l-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 sm:w-9 md:w-10 text-center border-t border-b border-gray-100 text-sm sm:text-base">
                        {item.cantidad}
                      </span>
                      <button 
                        onClick={() => incrementarCantidad(item.id)}
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-100 rounded-r-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => eliminarDelCarrito(item.id)}
                        className="ml-2 sm:ml-3 md:ml-4 p-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer del modal (solo si hay items) */}
        {carritoItems.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              <span>Subtotal</span>
              <span>${importeCompra.toFixed(2)}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Envío e impuestos calculados al finalizar</p>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handlePagar}
                className="w-full py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <span>Pagar ahora</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 sm:h-5 sm:w-5 ml-1.5 sm:ml-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => navigate("/productos")}
                className="w-full py-2.5 sm:py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;