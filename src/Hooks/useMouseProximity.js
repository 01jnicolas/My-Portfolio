import { useRef, useCallback } from 'react';

// Exportamos nuestro Custom Hook
export const useMouseProximity = (containerRef, view) => {
  // El seguro de rendimiento vive aquí adentro ahora
  const isTicking = useRef(false);

  // useCallback memoriza la función para no gastar memoria extra
  const handleMouseMove = useCallback((e) => {
    // Si no hay contenedor o no estamos en el home, abortamos
    if (!containerRef.current || view !== 'home') return;

    if (!isTicking.current) {
      window.requestAnimationFrame(() => {
        const buttons = containerRef.current.querySelectorAll('.corner-btn');

        buttons.forEach(btn => {
          const rect = btn.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

          const proximity = Math.max(0, 1 - distance / 500);
          btn.style.setProperty('--proximity', proximity);
        });

        isTicking.current = false;
      });
      
      isTicking.current = true;
    }
  }, [containerRef, view]); // Le decimos a React de qué variables depende esta función

  // El hook devuelve la función lista para usarse
  return handleMouseMove;
};