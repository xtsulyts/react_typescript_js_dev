import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';

const UsuarioContexto = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // URLs de la API
  const API_BASE = 'https://nodejs-25258.onrender.com/api/v1/usuarios';
  const LOGIN_URL = `${API_BASE}/login`;
  const LOGOUT_URL = `${API_BASE}/logout`;

  // Inicializar autenticación desde localStorage
  const initializeAuth = useCallback(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('usuarioData');
      
      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setUsuario(userData);
        setToken(storedToken);
        setIsAuthenticated(true);
        console.log('✅ Sesión recuperada de localStorage');
      }
    } catch (error) {
      console.error('❌ Error al recuperar sesión:', error);
      clearAuth(); // Limpiar datos corruptos
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ejecutar al montar el contexto
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Limpiar autenticación localmente
  const clearAuth = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuarioData');
    localStorage.removeItem('avatar');
    localStorage.removeItem('compra');
    
    setUsuario(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
    
    console.log('🔒 Autenticación local limpiada');
  }, []);

  // En UsuarioContexto.js - Solo la función login necesaria
const login = useCallback(async (credentials) => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Validación de credenciales
    if (!credentials?.email || !credentials?.contrasenia) {
      throw new Error('Email y contraseña requeridos');
    }

    //console.log('📤 Enviando credenciales a:', LOGIN_URL);
    //console.log('📤 Datos enviados:', credentials); // Para debug
    
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        contrasenia: credentials.contrasenia, // 🔴 Usar 'contrasenia' directamente
      })
    });

    // Manejar respuesta
    const responseText = await response.text();
    //console.log('📥 Respuesta del servidor:', responseText);
    
    let data = {};
    
    if (responseText && responseText.trim() !== '') {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Error parsing JSON:', parseError);
        throw new Error('Respuesta inválida del servidor');
      }
    }

    if (!response.ok) {
      const errorMsg = data.message || data.error || `Error ${response.status}`;
      throw new Error(errorMsg);
    }

    // Estructura de usuario
    const usuarioData = {
      id: data.usuario.id,
      email: data.usuario.email,
      nombre: data.usuario.nombre,
      rol: data.usuario.rol,
      // Campos adicionales si existen
      ...(data.usuario.apellido && { apellido: data.usuario.apellido }),
      ...(data.usuario.imagen && { imagen: data.usuario.imagen }),
      ...(data.usuario.activo !== undefined && { activo: data.usuario.activo }),
    };

    // Guardar en estado
    setUsuario(usuarioData);
    setToken(data.token);
    setIsAuthenticated(true);
    
    // Guardar en localStorage
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('usuarioData', JSON.stringify(usuarioData));
    
    if (usuarioData.imagen) {
      localStorage.setItem('avatar', usuarioData.imagen);
    }

    console.log('✅ Login exitoso:', usuarioData.email);
    
    return { 
      success: true, 
      usuario: usuarioData,
      token: data.token,
      mensaje: data.mensaje || 'Login exitoso'
    };
    
  } catch (err) {
    setError(err.message);
    console.error('❌ Login error:', err);
    throw err;
  } finally {
    setIsLoading(false);
  }
}, [LOGIN_URL]);
  // Logout con backend y frontend
  const logoutBackend = useCallback(async (currentToken) => {
    try {
      if (!currentToken) {
        console.log('⚠️  No hay token para logout en backend');
        return { success: true, mensaje: 'No había sesión activa en backend' };
      }

      console.log('📤 Enviando logout a backend...');
      
      const response = await fetch(LOGOUT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      });

      // Manejar respuesta
      const responseText = await response.text();
      let data = {};
      
      if (responseText && responseText.trim() !== '') {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.warn('⚠️  Respuesta no JSON en logout:', responseText);
        }
      }

      if (!response.ok) {
        console.warn('⚠️  Logout backend no exitoso:', response.status, data);
      } else {
        console.log('✅ Logout backend exitoso:', data.mensaje);
      }

      return { 
        success: response.ok, 
        ...data 
      };
      
    } catch (error) {
      console.error('❌ Error en logout backend:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }, [LOGOUT_URL]);

  // Función de alerta para logout
  const mostrarAlertaLogout = () => {
    return Swal.fire({
      title: "¿Estás seguro de cerrar sesión?",
      text: "Serás redirigido al inicio de sesión",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        popup: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700',
        title: 'text-lg font-semibold text-gray-900 dark:text-white',
        htmlContainer: 'text-gray-700 dark:text-gray-300',
        confirmButton: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200',
        cancelButton: 'px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 mr-3',
      },
      buttonsStyling: false
    });
  };

  // Función principal de logout
  const logout = useCallback(async () => {
    const result = await mostrarAlertaLogout();
    
    if (!result.isConfirmed) {
      // Usuario canceló
      await Swal.fire({
        title: "Cancelado",
        text: "Tu sesión sigue activa",
        icon: "info",
        timer: 1500,
        showConfirmButton: false
      });
      return false;
    }

    try {
      setIsLoading(true);
      const currentToken = token || localStorage.getItem('authToken');
      
      // 1. Logout en backend
      const backendResult = await logoutBackend(currentToken);
      
      // 2. Limpiar frontend (siempre se ejecuta)
      clearAuth();
      
      // 3. Mostrar confirmación
      await Swal.fire({
        title: "¡Sesión cerrada!",
        text: backendResult.mensaje || "Has salido correctamente del sistema",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl',
          title: 'text-lg font-semibold text-green-600 dark:text-green-400',
        }
      });
      
      // 4. Redirigir al login
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
      return true;
      
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      
      // Aún limpiamos frontend aunque falle el backend
      clearAuth();
      
      await Swal.fire({
        title: "Sesión cerrada localmente",
        text: "Hubo un error al contactar al servidor, pero tu sesión local fue cerrada.",
        icon: "warning",
        confirmButtonText: "Entendido"
      });
      
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [token, logoutBackend, clearAuth]);

  // Función para verificar roles
  const tieneRol = useCallback((rolRequerido) => {
    if (!usuario || !usuario.rol) return false;
    
    const rolUsuario = Number(usuario.rol);
    const rolNecesario = Number(rolRequerido);
    
    return rolUsuario === rolNecesario;
  }, [usuario]);

  // Función para obtener headers de autenticación
  const getAuthHeader = useCallback(() => {
    const currentToken = token || localStorage.getItem('authToken');
    if (!currentToken) return {};
    
    return { 
      'Authorization': `Bearer ${currentToken}`,
      'Content-Type': 'application/json'
    };
  }, [token]);

  // Fetch autenticado
  const fetchAutenticado = useCallback(async (url, options = {}) => {
    const headers = {
      ...getAuthHeader(),
      ...options.headers,
    };
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Si la respuesta es 401 (no autorizado), hacer logout
    if (response.status === 401) {
      console.warn('⚠️  Token inválido o expirado, cerrando sesión...');
      await logout();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    return response;
  }, [getAuthHeader, logout]);

  // Actualizar datos del usuario
  const actualizarUsuario = useCallback((nuevosDatos) => {
    setUsuario(prev => {
      const usuarioActualizado = { ...prev, ...nuevosDatos };
      localStorage.setItem('usuarioData', JSON.stringify(usuarioActualizado));
      return usuarioActualizado;
    });
  }, []);

  // Verificar token periódicamente (opcional)
  useEffect(() => {
    if (!token) return;
    
    const verificarToken = async () => {
      try {
        // Podrías implementar una ruta de verificación de token
        // const response = await fetch(`${API_BASE}/verificar-token`, {
        //   headers: getAuthHeader()
        // });
        // 
        // if (response.status === 401) {
        //   console.warn('Token expirado, cerrando sesión...');
        //   logout();
        // }
      } catch (error) {
        console.error('Error verificando token:', error);
      }
    };
    
    // Verificar cada 5 minutos
    const interval = setInterval(verificarToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token, getAuthHeader, logout]);

  // Valor del contexto
  const value = {
    usuario,
    isAuthenticated,
    isLoading,
    error,
    token,
    login,
    logout,
    tieneRol,
    getAuthHeader,
    fetchAutenticado,
    actualizarUsuario,
    // Debug info (solo desarrollo)
    ...(process.env.NODE_ENV === 'development' && {
      debugInfo: {
        apiBase: API_BASE,
        tokenLength: token?.length || 0
      }
    })
  };

  return (
    <UsuarioContexto.Provider value={value}>
      {children}
    </UsuarioContexto.Provider>
  );
};

// Hook personalizado
export const useUsuario = () => {
  const context = useContext(UsuarioContexto);
  
  if (!context) {
    throw new Error('useUsuario debe usarse dentro de UsuarioProvider');
  }
  
  return context;
};