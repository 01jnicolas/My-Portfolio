import { motion } from "framer-motion";

// Esta es la función que puedes llamar
const FloatingLight = ({ color, size, duration }) => {
 // 1. Usamos un rango más pequeño (20% a 80%) para que no se salgan
  const randomPos = () => `${Math.floor(Math.random() * 120) - 10}`; 

   // 1. Definimos un punto de inicio fijo para esta instancia
  const startX = `${randomPos()}vw`;
  const startY = `${randomPos()}vh`;

  const randomPath = {
    // Definimos 4 puntos para una ruta fluida, volviendo al inicio
    x: [startX, `${randomPos()}vw`, `${randomPos()}vw`, startX],
    y: [startY, `${randomPos()}vh`, `${randomPos()}vh`, startY]
  };

    return (
        <motion.div
            className="bg-circle" // <-- Aquí hereda todo lo del CSS de arriba
            animate={{
                x: randomPath.x,
                y: randomPath.y,
            }}
            transition={{
                duration: duration || 20,
                repeat: Infinity,
                ease: "linear",
            }}
            style={{
                // Solo dejamos lo que queremos que sea dinámico
                width: size || "500px",
                height: size || "500px",
                backgroundColor: color || "#D44720",
            }}
        />
    );
};

export default FloatingLight;