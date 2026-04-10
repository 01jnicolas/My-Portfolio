import React from 'react';
import { motion } from "framer-motion";

const AnimatedText = ({ text, className }) => {
  // 1. Dividimos la frase en letras individuales
  const letters = Array.from(text);

  // 2. Variantes para el CONTENEDOR (La pre-composición padre)
  // Maneja el retraso en cascada entre cada letra
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  // 3. Variantes para CADA LETRA (Los keyframes individuales)
  // Faltaba esta parte en tu código. Le dice a Framer Motion CÓMO se mueve la letra
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20, // Empiezan 20px más abajo
    },
  };

  // 4. El Return: Renderizamos el contenedor y mapeamos las letras
  return (
    <motion.div 
      className={className} 
      variants={container} 
      initial="hidden" 
      animate="visible"
    >
      {/* El método .map() itera sobre cada letra de tu frase */}
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {/* TRUCO CLAVE: Si la letra es un espacio vacío, usamos "\u00A0" 
              para que el navegador no lo ignore y junte las palabras */}
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;