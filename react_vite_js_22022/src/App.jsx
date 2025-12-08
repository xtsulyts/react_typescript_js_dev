import HomePages from "./pages/HomePages.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import "./App.css";
import ListaPages from "./pages/ListaPages.jsx";
//import ListaProductos from "./components/ListaProductos.jsx";
import NoFoundPages from "./pages/NoFoundPages.jsx";
import ContactoPages from "./pages/ContactoPages.jsx";
import DocumentacionPages from "./pages/DocumentacionPages.jsx";
import CarritoPages from "./pages/CarritoPages.jsx";
import DetallePages from "./pages/DetallePages.jsx";
import UsuariosPrueba from "./components/UsuariosPrueba.jsx";
import LoginPages from "./pages/LoginPages.jsx";
import RutaProtegida from "./autenticacion/RutaProtegida.jsx";
//import Admin from "./components/Admin.jsx";
import { useCarrito } from "./contex/CarritoContexto.jsx";
import { useUsuario } from "./contex/UsuarioContexto.jsx";
import AdminPages from "./pages/AdminPages.jsx";
import ComprasPages from "./pages/ComprasPages.jsx";
import { RegistroUsuarioPages } from "./pages/RegistroUsuarioPages.jsx";

function App() {
  const { carrito, handleAgregarCarrito, productos, loading } =
    useCarrito();
  const { login, isAuthenticated  } = useUsuario();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route
          path="/productos"
          element={
            <ListaPages
              productos={productos}
              carrito={carrito}
              handleAgregarCarrito={handleAgregarCarrito}
              loading={loading}
            />
          }
        />
        <Route
          path="/productos/:id"
          element={
            <DetallePages
              productos={productos}
              carrito={carrito}
              handleAgregarCarrito={handleAgregarCarrito}
              loading={loading}
            />
          }
        />
        <Route path="/compras" element={<ComprasPages/>}/>
        <Route path="/carrito" element={<CarritoPages carrito={carrito} />} />
        <Route path="/contacto" element={<ContactoPages />} />
        <Route
          path="/documentacion"
          element={
            <RutaProtegida autenticado={isAuthenticated}>
              <DocumentacionPages />{" "}
            </RutaProtegida>
          }
        />

        <Route path="*" element={<NoFoundPages />} />
        <Route path="/login" element={<LoginPages login={login} />} />
        <Route path="/usuarios" element={<UsuariosPrueba />} />
        <Route
          path="administracion"
          element={
            <RutaProtegida autenticado={isAuthenticated}>
              <AdminPages />{isAuthenticated}
            </RutaProtegida>
          }
        />
        <Route path="registro" element={<RegistroUsuarioPages/>}/>
      </Routes>
    </Router>
  );
}

export default App;
