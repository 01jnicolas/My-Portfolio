import { useState } from "react";
import { motion as Motion } from "framer-motion";

// Esta es la función que puedes llamar
const FloatingLight = ({ color, size, duration }) => {
  const [randomPath] = useState(() => {
    const randomPos = () => `${Math.floor(Math.random() * 120) - 10}`;
    const startX = `${randomPos()}vw`;
    const startY = `${randomPos()}vh`;
    return {
      x: [startX, `${randomPos()}vw`, `${randomPos()}vw`, startX],
      y: [startY, `${randomPos()}vh`, `${randomPos()}vh`, startY],
    };
  });

    return (
        <Motion.div
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
