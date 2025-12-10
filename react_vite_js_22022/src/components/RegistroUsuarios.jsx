import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const RegistroUsuarios = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasenia: '',
    confirmarContrasenia: '',
    activo: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  /**
   * Valida el formulario completo
   */
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    // Validar contraseña
    if (!formData.contrasenia) {
      newErrors.contrasenia = 'La contraseña es requerida';
    } else if (formData.contrasenia.length < 6) {
      newErrors.contrasenia = 'Mínimo 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmarContrasenia) {
      newErrors.confirmarContrasenia = 'Por favor confirma tu contraseña';
    } else if (formData.contrasenia !== formData.confirmarContrasenia) {
      newErrors.confirmarContrasenia = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja cambios en los inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Preparar datos para enviar al backend
      const userData = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        contrasenia: formData.contrasenia,
        activo: true,
        rol: 3
      };
      
      //console.log('Enviando datos:', userData);
      const API_URL = 'https://nodejs-25258.onrender.com/api/v1/usuarios/crear-usuario';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
      });
      
      console.log('Status de respuesta:', response.status);
      console.log('OK?', response.ok);
      
      // Obtener respuesta como texto primero
      const responseText = await response.text();
      console.log('Texto de respuesta:', responseText);
      
      let data = {};
      if (responseText && responseText.trim() !== '') {
        try {
          data = JSON.parse(responseText);
          //console.log('Datos parseados:', data);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          console.error('Texto que causó el error:', responseText);
          throw new Error(`Respuesta inválida del servidor: ${responseText.substring(0, 100)}`);
        }
      } else {
        console.log('Respuesta vacía del servidor');
        data = { message: 'Sin mensaje del servidor' };
      }
      
      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        const errorMessage = data.message || 
                            data.error || 
                            `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      // Registro exitoso
      await Swal.fire({
        title: '¡Registro exitoso!',
        text: data.message || 'Tu cuenta ha sido creada correctamente',
        icon: 'success',
        confirmButtonText: 'Iniciar Sesión',
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
          navigate('/login');
        }
      });
      
    } catch (error) {
      console.error('Error completo en registro:', error);
      
      // Mensajes de error más específicos
      let errorMessage = 'Error al registrar usuario';
      let errorTitle = 'Error';
      
      if (error.message.includes('NetworkError') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://127.0.0.1:3000';
        errorTitle = 'Error de conexión';
      } else if (error.message.includes('404')) {
        errorMessage = 'Endpoint no encontrado. Verifica que la ruta /api/v1/usuarios/crear-usuario exista.';
        errorTitle = 'Ruta no encontrada';
      } else if (error.message.includes('500')) {
        errorMessage = 'Error interno del servidor. Revisa la consola del backend.';
        errorTitle = 'Error del servidor';
      } else if (error.message.includes('400')) {
        errorMessage = 'Datos inválidos enviados al servidor.';
        errorTitle = 'Datos inválidos';
      } else if (error.message.includes('email') || error.message.includes('Email')) {
        errorMessage = 'El email ya está registrado o es inválido.';
        errorTitle = 'Email no disponible';
      } else if (error.message.includes('password') || error.message.includes('contraseña')) {
        errorMessage = 'La contraseña no cumple los requisitos.';
        errorTitle = 'Contraseña inválida';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      await Swal.fire({
        title: errorTitle,
        html: `<div class="text-left">
                <p class="mb-2">${errorMessage}</p>
                <p class="text-sm text-gray-600 mt-3">Verifica:</p>
                <ul class="text-sm text-gray-600 list-disc pl-5 mt-1">
                  <li>Que el backend esté corriendo</li>
                  <li>Que la ruta sea correcta</li>
                  <li>Los datos del formulario</li>
                </ul>
              </div>`,
        icon: 'error',
        confirmButtonText: 'Entendido',
        width: '500px'
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta</h2>
        
        {/* Información sobre el tipo de cuenta */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 text-center">
            Estás creando una cuenta de <span className="font-semibold">cliente (Rol 3)</span>
          </p>
        </div>

        {/* Campo Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-gray-700 mb-2">
            Nombre Completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-500" />
            </div>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none ${
                errors.nombre ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              disabled={isSubmitting}
            />
          </div>
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
        </div>

        {/* Campo Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-500" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Campo Contraseña */}
        <div className="mb-4">
          <label htmlFor="contrasenia" className="block text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-500" />
            </div>
            <input
              type="password"
              id="contrasenia"
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none ${
                errors.contrasenia ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </div>
          {errors.contrasenia && <p className="text-red-500 text-sm mt-1">{errors.contrasenia}</p>}
        </div>

        {/* Campo Confirmar Contraseña */}
        <div className="mb-6">
          <label htmlFor="confirmarContrasenia" className="block text-gray-700 mb-2">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-500" />
            </div>
            <input
              type="password"
              id="confirmarContrasenia"
              name="confirmarContrasenia"
              value={formData.confirmarContrasenia}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none ${
                errors.confirmarContrasenia ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </div>
          {errors.confirmarContrasenia && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmarContrasenia}</p>
          )}
        </div>

        {/* Botón de Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-70 mb-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando cuenta...
            </span>
          ) : 'Registrarse'}
        </button>

        {/* Enlace a login */}
        <div className="text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link 
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Información de debugging (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-100 border border-gray-300 rounded-md text-xs text-gray-600">
            <p className="font-medium mb-1">Info para desarrollo:</p>
            <p>Endpoint: <code>http://127.0.0.1:3000/api/v1/usuarios/crear-usuario</code></p>
            <p className="mt-1">Revisa la consola del navegador para ver logs detallados.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegistroUsuarios;