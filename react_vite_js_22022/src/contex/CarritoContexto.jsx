import React, { createContext, useState, useEffect, useContext } from 'react';
//import { RingLoader } from 'react-spinners';

const API_KEY = "9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125";

const MOCKAPI_URL = "https://67f5e9af913986b16fa5e489.mockapi.io/api/products"

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
  const [productos, setProductos] = useState([]);
  
  // Estado de carga
  const [loading, setLoading] = useState(true);
  
  // Manejo de errores
  const [error, setError] = useState(null);
  
  // Estado para las imágenes de productos
  const [imagenes, setImagenes] = useState([]);
  
 
  // URL para el loader de carga
  const LOADER_URL = "https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif";

  /**
   * Efecto para cargar datos al montar el componente
   * Realiza peticiones a:
   * - API de Pexels para imágenes de productos
   * - MockAPI para datos de productos
   */
  useEffect(() => {
  // Función hash mejorada para generar un índice estable a partir de un string (ID)
  function hashId(str, max) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convierte a entero de 32 bits
    }
    return Math.abs(hash) % max;
  }

  // Fetch inicial de datos
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
  
      
      const [imagesResponse, productosResponse] = await Promise.all([
          // Llamar a la función serverless en Netlify
          fetch(`/.netlify/functions/pexels-proxy?query=sneakers+shoes&per_page=80&orientation=landscape&size=medium`),
          fetch(MOCKAPI_URL, {
              mode: 'cors'
          }),
      ]);
        
      if (!imagesResponse.ok) throw new Error("Error en API de imágenes");
      if (!productosResponse.ok) throw new Error("Error en API de productos");
  
      const [imagesData, productosData] = await Promise.all([
        imagesResponse.json(),
        productosResponse.json(),
      ]);
  
      setImagenes(imagesData.photos);
  
      // Combinar productos con sus imágenes usando hashId para asignación consistente
      const combinedData = productosData.map(producto => {
        // Usamos el ID del producto para obtener siempre la misma imagen
        const imageIndex = hashId(producto.id.toString(), imagesData.photos.length);
        return {
          ...producto,
          imagen: imagesData.photos[imageIndex]?.src.medium || 
                 "https://via.placeholder.com/300",
        };
      });
  
      setProductos(combinedData);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []); // <-- Aquí solo debe haber un cierre del useEffect

    useEffect(() => {
    //console.log("Productos actualizados:", productos);
  }, [productos]);


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