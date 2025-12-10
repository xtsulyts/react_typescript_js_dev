import React, { createContext, useState, useEffect, useContext } from 'react';

//const MOCKAPI_URL = "https://nodejs-25258.onrender.com/api/v1/productos"
const MOCKAPI_URL = "http://localhost:3000/api/v1/productos"


/**
 * Contexto para manejar el estado global del carrito de compras
 * Proporciona:
 * - Lista de productos
 * - Estado del carrito
 * - Funciones para manipular el carrito
 * - Estado de autenticación         
 */
const CarritoContext = createContext();

/**
 * Proveedor del contexto del carrito
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export const CarritoProvider = ({ children }) => {
  // Estado para los productos en el carrito
  const [carrito, setCarrito] = useState([]);
  
  // Estado para todos los productos disponibles
  const [ productos, setProductos] = useState([]);
  
  // Estado de carga
  const [loading, setLoading] = useState(true);
  
  // Manejo de errores
  const [error, setError] = useState(null);
  
  // Estado para las imágenes de productos
  const [imagenes, setImagenes] = useState([]);
  
  // URL para el loader de carga
  const LOADER_URL = "https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif";

  /**
   * Función hash para generar un índice estable a partir de un string (ID)
   * @param {string} str - String a hashear (ID del producto)
   * @param {number} max - Máximo valor para el hash
   * @returns {number} - Hash resultante
   */
  function hashId(str, max) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convierte a entero de 32 bits
    }
    return Math.abs(hash) % max;
  }

  /**
   * Obtiene productos desde tu API
   * @returns {Promise<Array>} - Array de productos transformados
   */
  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(MOCKAPI_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Verifica la estructura de respuesta de tu API
      if (result.success && result.data) {
        // Transforma los datos para tu aplicación
        const productosTransformados = result.data.map(producto => ({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          descripcion: producto.descripcion,
          categoria: producto.categoria,
          subcategoria: producto.subcategoria,
          marca: producto.marca,
          estado: producto.Estado,
          caracteristicas: producto.Caracteristicas,
          especificaciones: producto.Especificaciones,
          fechaCreacion: producto["Fecha de creacion"],
          // Asigna una imagen usando hashId si hay imágenes disponibles
          imagen: imagenes.length > 0 ? 
            imagenes[hashId(producto.id, imagenes.length)]?.src?.medium || '' : ''
        }));
        
        setProductos(productosTransformados);
        return productosTransformados;
      } else {
        throw new Error(result.message || 'Formato de respuesta incorrecto');
      }
      
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setError(err.message || 'Error al cargar los productos');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Efecto para cargar datos al montar el componente
   * Realiza peticiones a la API de productos y opcionalmente a imágenes
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Solo cargar productos por ahora (las imágenes están comentadas)
        await fetchProductos();
        
        // Si necesitas cargar imágenes más adelante, puedes descomentar esto:
        /*
        const imagesResponse = await fetch("https://api.pexels.com/v1/search?query=electronics&per_page=50", {
          headers: { Authorization: 'TU_API_KEY_AQUI' },
        });
        
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          setImagenes(imagesData.photos || []);
        }
        */
        
      } catch (err) {
        setError('Error al cargar los datos iniciales: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Agrega un producto al carrito o actualiza su cantidad si ya existe
   * @param {Object} producto - Producto a agregar
   * @param {number} cantidad - Cantidad del producto
   */
  const handleAgregarCarrito = (producto, cantidad) => {
    setCarrito(prevCarrito => {
      const itemExistente = prevCarrito.find(item => item.id === producto.id);
      
      if (itemExistente) {
        return prevCarrito.map(item =>
          item.id === producto.id ? { ...item, cantidad } : item
        );
      }
      
      return [...prevCarrito, { ...producto, cantidad }];
    });
  };

  /**
   * Elimina un producto del carrito
   * @param {string} productoId - ID del producto a eliminar
   */
  const eliminarDelCarrito = (productoId) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== productoId));
  };

  /**
   * Actualiza la cantidad de un producto en el carrito
   * @param {string} productoId - ID del producto
   * @param {number} nuevaCantidad - Nueva cantidad
   */
  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  /**
   * Vacía completamente el carrito
   */
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  /**
   * Calcula el total de productos en el carrito
   * @returns {number} - Cantidad total de items
   */
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  /**
   * Calcula el precio total del carrito
   * @returns {number} - Precio total
   */
  const precioTotal = carrito.reduce(
    (total, item) => total + (item.precio * item.cantidad), 0
  );

  // Valor que será accesible para los componentes que consuman este contexto
  const value = {
    carrito,
    productos,
    imagenes,
    loading,
    error,
    LOADER_URL,
    totalItems,
    precioTotal,
    handleAgregarCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    fetchProductos, // Nueva función agregada
    setProductos,
    setError,
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto del carrito
 * @returns {Object} - Todos los valores del contexto
 */
export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};