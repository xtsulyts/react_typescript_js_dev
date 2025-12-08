import { useState, useEffect } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useUsuario } from '../contex/UsuarioContexto';
import { useNavigate, Link } from 'react-router-dom';
import Swal from "sweetalert2";

const LoginForm = () => {
  // 🔴 IMPORTANTE: Cambiar a los nombres que espera el backend
  const [credentials, setCredentials] = useState({
    email: '',      // El backend espera 'email'
    contrasenia: '' // El backend espera 'contrasenia' (NO 'password')
  });
  
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { login, isAuthenticated, isLoading } = useUsuario();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/productos');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validar email
    if (!credentials.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(credentials.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    // Validar contraseña (ahora se llama 'contrasenia')
    if (!credentials.contrasenia) {
      newErrors.contrasenia = 'La contraseña es requerida';
    } else if (credentials.contrasenia.length < 6) {
      newErrors.contrasenia = 'Mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (loginError) setLoginError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      setLoginError(null);
      
      // 🔴 ENVIAR las credenciales TAL CUAL (el contexto ya no las transforma)
      const result = await login(credentials);
      
      // Mostrar mensaje de éxito
      await Swal.fire({
        title: `¡Bienvenid@, ${result.usuario.nombre}!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl',
          title: 'text-lg font-semibold text-green-600 dark:text-green-400',
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Credenciales incorrectas';
      let errorTitle = 'Error de autenticación';
      
      // Mensajes de error más específicos
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión.';
        errorTitle = 'Error de conexión';
      } else if (error.message.includes('404')) {
        errorMessage = 'Servicio no disponible temporalmente.';
        errorTitle = 'Servicio no disponible';
      } else if (error.message.includes('401') || error.message.includes('Invalid credentials')) {
        errorMessage = 'Email o contraseña incorrectos.';
        errorTitle = 'Credenciales inválidas';
      } else if (error.message.includes('email') || error.message.includes('Email')) {
        errorMessage = 'El email no está registrado o es inválido.';
        errorTitle = 'Email no encontrado';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setLoginError(errorMessage);
      
      await Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
        customClass: {
          popup: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl',
          confirmButton: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md'
        }
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar spinner si está cargando la sesión inicial
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, mostrar mensaje de redirección
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ya estás autenticado</h2>
          <p className="text-gray-600 mb-4">Serás redirigido en unos segundos...</p>
          <button
            onClick={() => navigate('/productos')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            O haz clic aquí para ir ahora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        noValidate
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión</h2>
          <p className="text-center text-gray-600 text-sm mt-2">
            Accede a tu cuenta con tu email y contraseña
          </p>
        </div>
        
        {loginError && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
            <div className="flex">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{loginError}</span>
            </div>
          </div>
        )}

        {/* Campo Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-500" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none transition-colors ${
                errors.email 
                  ? 'border-red-500 bg-red-50 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Campo Contraseña - AHORA LLAMADO 'contrasenia' */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="contrasenia" className="block text-gray-700">
              Contraseña
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-500" />
            </div>
            <input
              type="password"
              id="contrasenia"
              name="contrasenia"  // 🔴 CAMBIADO A 'contrasenia'
              value={credentials.contrasenia}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none transition-colors ${
                errors.contrasenia  // 🔴 CAMBIADO A 'contrasenia'
                  ? 'border-red-500 bg-red-50 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>
          {errors.contrasenia && (  // 🔴 CAMBIADO A 'contrasenia'
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.contrasenia}  {/* 🔴 CAMBIADO A 'contrasenia' */}
            </p>
          )}
        </div>

        {/* Botón de Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verificando...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Ingresar
            </span>
          )}
        </button>

        {/* Información adicional */}
          <div className="mt-4 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <a 
              href="/registro" 
              className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
              onClick={(e) => {
                e.preventDefault();
                navigate('/registro');
              }}
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;