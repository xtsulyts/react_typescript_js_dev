import { useState } from "react";
import "../components/estilos/Header.css"; // Archivo de estilos (opcional)
import { FaShopify } from "react-icons/fa";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useUsuario } from "../contex/UsuarioContexto";
import { useNavigate } from "react-router-dom";
//import { useCarrito } from "../contex/CarritoContexto";
//import { HiUser } from "react-icons/hi";
//import Swal from "sweetalert2";
import Nav from "./Nav";

const Header = () => {
  //const { precioTotal } = useCarrito(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { usuario, logout, isAuthenticated } = useUsuario();

return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo y título - Ajustado para línea horizontal en móvil */}
          <div className="header-brand flex items-center space-x-2 sm:space-x-3">
            <FaShopify className="header-logo" />
            <h1 className="header-titulo">E-Shop Tech</h1>
          </div>

          {/* Área de usuario */}
          <div className="flex relative">
            {isAuthenticated ? (
              <div className="relative">
                {/* Botón del usuario */}
                <div
                  className="flex items-center cursor-pointer hover:text-yellow-400 hover:underline"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {usuario?.image ? (
                    <img
                      src={usuario.imagen}
                      alt={usuario.nombre}
                      className="w-6 h-6 rounded-full object-cover mr-2 sm:w-7 sm:h-7 md:w-8 md:h-8"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/128';
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2 sm:w-7 sm:h-7 md:w-8 md:h-8">
                      <span className="text-xs text-gray-600 sm:text-sm">?</span>
                    </div>
                  )}
                  <span className="ml-1 text-sm sm:text-base md:text-lg">
                    {usuario.nombre}
                  </span>
                </div>

                {/* Menú desplegable */}
                {isDropdownOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 sm:w-56 md:w-64"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <button
                      onClick={() => navigate("/perfil")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 sm:py-3 md:text-base"
                    >
                      Perfil
                    </button>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 sm:py-3 md:text-base"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="header-login-btn"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </header>
      <Nav />
    </>
  );
};

export default Header;
