import { useState, useEffect } from 'react';
import React from "react";
import { useUsuario } from '../contex/UsuarioContexto';
import { useCarrito } from '../contex/CarritoContexto';
import Swal from 'sweetalert2';

/**
 * Componente CarruselOfertas - Muestra ofertas especiales en formato de carrusel
 * 
 * Props:
 * @param {boolean} autoPlay - Habilita la rotación automática (default: true)
 * @param {number} interval - Intervalo en ms para cambio de slide (default: 5000)
 * @param {boolean} showControls - Muestra flechas de navegación (default: true)
 * @param {boolean} showIndicators - Muestra indicadores de posición (default: true)
 * @param {number} maxProducts - Máximo de productos a mostrar en el carrusel (default: 3)
 */
const CarruselOfertas = ({
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  maxProducts = 3
}) => {
  // Contextos
  const { autenticado } = useUsuario();
  const { handleAgregarCarrito, productos, loading, error } = useCarrito();
  
  // Estado para las ofertas generadas
  const [ofertas, setOfertas] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Generar ofertas cuando los productos cambien
  useEffect(() => {
    if (!productos || productos.length === 0) {
      setOfertas([]);
      return;
    }

    // Tomar los primeros N productos para el carrusel
    const productosParaOfertas = productos.slice(0, maxProducts);
    
    // Crear ofertas basadas en los productos reales
    const nuevasOfertas = productosParaOfertas.map((producto, index) => ({
      id: producto.id || `producto-${index}`,
      imagen: producto.imagen || `https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=${index}`,
      titulo: producto.nombre || `Producto ${index + 1}`,
      descripcion: producto.descripcion ? 
        `${producto.descripcion.substring(0, 60)}... ¡Precio especial!` : 
        `¡Oferta especial! $${producto.precio}`,
      productoId: producto.id,
      enlace: `/productos/${producto.id}`,
      precio: producto.precio || 0,
      cantidad: producto.stock || 10, // Valor por defecto si no hay stock
      productoOriginal: producto // Guardar referencia al producto completo
    }));

    setOfertas(nuevasOfertas);
    
    // Resetear slide si cambian los productos
    if (nuevasOfertas.length > 0 && currentSlide >= nuevasOfertas.length) {
      setCurrentSlide(0);
    }
  }, [productos, maxProducts]);

  // Efecto para el auto-play
  useEffect(() => {
    if (!autoPlay || isHovered || ofertas.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ofertas.length);
    }, interval);

    return () => clearInterval(timer);
  }, [ofertas.length, autoPlay, interval, isHovered]);

  // Cambiar slide manualmente
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Navegación anterior/siguiente
  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + ofertas.length) % ofertas.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % ofertas.length);
  };

  // Funciones de utilidad
  const funcionalidadPendiente = () => {
    Swal.fire({
      title: "Funcionalidad pendiente",
      text: "Esta característica estará disponible pronto",
      icon: "info",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  };

  const agregarAlCarrito = (oferta) => {
    if (!autenticado) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito",
        icon: "warning",
        confirmButtonText: "Entendido"
      });
      return;
    }

    // Usar el producto original del contexto
    const producto = oferta.productoOriginal || oferta;
    
    handleAgregarCarrito(producto, 1);
    
    Swal.fire({
      title: "¡Producto agregado!",
      text: `${producto.nombre} se agregó al carrito`,
      icon: "success",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-red-500">Error al cargar las ofertas</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!ofertas || ofertas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No hay ofertas disponibles en este momento</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {ofertas.map((oferta) => (
          <div
            key={oferta.id}
            className="w-full flex-shrink-0 relative group"
          >
            {/* Imagen de fondo */}
            <div className="relative h-96 w-full">
              <img
                src={oferta.imagen}
                alt={oferta.titulo}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Overlay de información */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-8">
                <div className="max-w-2xl">
                  <h3 className="text-3xl font-bold text-white mb-2">{oferta.titulo}</h3>
                  <p className="text-xl text-white mb-4">{oferta.descripcion}</p>
                  <p className="text-2xl font-bold text-amber-300 mb-6">${oferta.precio.toLocaleString()}</p>
                  
                  <div className="flex gap-4">
                    <a
                      onClick={() => funcionalidadPendiente()}
                      className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
                    >
                      Ver detalles
                    </a>
                    <button
                      onClick={() => agregarAlCarrito(oferta)}
                      className="px-6 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!autenticado}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Añadir al carrito
                    </button>
                  </div>
                  
                  {!autenticado && (
                    <p className="text-white/80 text-sm mt-4">
                      * Inicia sesión para agregar productos al carrito
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      {showControls && ofertas.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300"
            aria-label="Anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300"
            aria-label="Siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicadores de posición */}
      {showIndicators && ofertas.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {ofertas.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-amber-400 w-6' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir a la oferta ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarruselOfertas;