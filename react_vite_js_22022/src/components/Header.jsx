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
          {/* Logo y título */}
          <div className="header-brand">
            {<FaShopify className="header-logo" />}
            <h1 className="header-titulo">E-Shop Tech</h1>
          </div>

          {/* <div className="flex items-center bg-indigo-50 rounded-full px-4 py-2">
            <ShoppingCartIcon className="h-5 w-5 mr-2 text-indigo-600" />
            <span className="font-bold text-indigo-800">
              ${usuario ? precioTotal : 0}
            </span>
          </div> */}

          {/* Área de usuario */}
          <div className="flex relative">
            {isAuthenticated ? (
              <div className="relative">
                {/* Botón del usuario - ahora con imagen en lugar del icono */}
                <div
                  className="flex items-center cursor-pointer hover:text-yellow-400 hover:underline"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {usuario?.image ? (
                    <img
                      src={usuario.image}
                      alt={usuario.username}
                      className="w-6 h-6 rounded-full object-cover mr-2"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/128';
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                      <span className="text-xs text-gray-600">?</span>
                    </div>
                  )}
                  <span className="ml-1">{usuario.username}</span>
                </div>

                {/* Menú desplegable - se activa solo por click */}
                {isDropdownOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <button
                      onClick={() => navigate("/perfil")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Perfil
                    </button>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
