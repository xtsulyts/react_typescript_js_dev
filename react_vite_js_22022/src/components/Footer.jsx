import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCreditCard, FaShieldAlt, FaHeadset } from "react-icons/fa";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Sección superior */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Columna 1 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Navegacion</h3>
                <ul className="space-y-2">
  {[
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/productos' },
    { name: 'Contacto', path: '/contacto' },
    //{ name: 'Usuarios de prueba', path: '/usuarios' },  
    { name: 'Login', path: '/login' },
    // { name: 'Administracion', path: '/administracion' },
    // { name: 'Documentacion', path: '/documentacion' },
    { name: 'Carrito', path: '/carrito' }
  ].map((item) => (
    <li key={item.name}>
      <Link 
        to={item.path} 
        className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
      >
        {item.name}
      </Link>
    </li>
  ))}
</ul>
        </div>

        {/* Columna 2 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Ayuda</h3>
          <ul className="space-y-2">
            {['Centro de ayuda', 'Estado del pedido', 'Devoluciones', 'Contacto'].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Legal</h3>
          <ul className="space-y-2">
            {['Términos y condiciones', 'Política de privacidad', 'Aviso legal', 'Cookies'].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 4 - Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contacto</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaHeadset className="text-yellow-500 dark:text-yellow-400" />
              <span className="text-gray-600 dark:text-gray-400">Soporte</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">contacto@eShopTech.com</p>
            <div className="flex space-x-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                <a key={index} href="#" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección de pagos y seguridad */}
      <div className="bg-gray-100 dark:bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <FaCreditCard className="text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Métodos de pago seguros</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaShieldAlt className="text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Compra protegida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-50 dark:bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} E-Shoes Shop. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;