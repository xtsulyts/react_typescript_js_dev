import { useState } from "react";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../contex/CarritoContexto";
import { useUsuario } from "../contex/UsuarioContexto";


const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { precioTotal } = useCarrito();
  const { usuario, tieneRol } = useUsuario();
  
  const menuItems = [
    { name: "Inicio", path: "/" },
    { name: "Productos", path: "/productos" },
    { name: "Compras", path: "/compras" },
    { name: "Contacto", path: "/contacto" },
    //{ name: "Administracion", path: "/administracion" },
  ];

  return (
    <>
      {/* Barra superior decorativa */}
      <div className="bg-gradient-to-r from-pink-500 to-yellow-400 h-2 w-full"></div>
      
      {/* Barra de navegación principal */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Menú desktop - CENTRADO */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center space-x-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-lg  transition-colors duration-300 relative group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Botón carrito (ahora a la derecha) */}
            <div className="hidden md:block">
              <button
                onClick={() => navigate('/carrito')}
                className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full hover:shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>{precioTotal}</span>
              </button>
            </div>

            {/* Botón mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none"
              >
                {isOpen ? (
                  <XMarkIcon className="h-8 w-8" />
                ) : (
                  <Bars3Icon className="h-8 w-8" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú mobile */}
        <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-xl">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-md text-lg font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-300 border-b border-gray-100"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => {<Link to={"/carrito"}/>
                setIsOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-3 rounded-md text-lg font-medium text-purple-600 hover:bg-purple-50 transition-colors duration-300"
            >
              <span className="flex items-center">
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Carrito
              </span>
              <span className="bg-purple-100 text-purple-600 rounded-full px-2 py-0.5 text-xs font-bold">${precioTotal}</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;