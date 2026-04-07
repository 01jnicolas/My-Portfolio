import { motion as Motion, AnimatePresence } from 'framer-motion'; //Importacion de animacion
import React, { useState, useRef } from 'react' // importar el react
import './App.css';


function App() {

  const [view, setView] = useState('home'); // 'home', 'anim', 'web', 'video', 'games'
  const containerRef = useRef(null);

  // Mapping for cleaner animation logic
  const viewConfig = {
    anim:  { x: 800,  y: 600 },
    web:   { x: 800,  y: -600 },
    games: { x: -800, y: 600 },
    video: { x: -800, y: -600 },
    home:  { x: 0,    y: 0 }
  };

  const backBtnConfig = {
  anim:  { bottom: '40px', right: '40px', top: 'auto', left: 'auto' }, // Esquina Inferior Derecha
  web:   { top: '40px',    right: '40px', bottom: 'auto', left: 'auto' }, // Esquina Superior Derecha
  games: { bottom: '40px', left: '40px',  top: 'auto', right: 'auto' }, // Esquina Inferior Izquierda
  video: { top: '40px',    left: '40px',  bottom: 'auto', right: 'auto' }, // Esquina Superior Izquierda
};

  const handleMouseMove = (e) => {
    if (!containerRef.current || view !== 'home') return;

    // Buscamos todos los botones dentro del contenedor
    const buttons = containerRef.current.querySelectorAll('.corner-btn');
    
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      
      // Ajustamos el radio de proximidad a 500px para que sea más natural
      const proximity = Math.max(0, 1 - distance / 500);
      btn.style.setProperty('--proximity', proximity);
    });
  };

  return (
    <main className="main-layout">
      {/* Circles*/}
      <div className="bg-circle"></div>
      <div className="bg-circle-2"></div>
      <div className="bg-circle-3"></div>

      <AnimatePresence>
        {view !== 'home' && (
          <Motion.button
            key="back-button" // Key para que AnimatePresence rastree el mismo elemento
            className="back-home-btn"
            aria-label="Volver al inicio"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, ...backBtnConfig[view] }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            onClick={() => setView('home')}
          >
            ← Volver al Home
          </Motion.button>
        )}
      </AnimatePresence>

      <Motion.div 
        className="bubble-container" 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        initial={false}
        animate={{
          x: viewConfig[view]?.x ?? 0,
          y: viewConfig[view]?.y ?? 0,
          scale: view === 'home' ? 1 : 0.1, //Escala el home(Burbuja)
          rotateY: view === 'home' ? 0 : 45, //Rota para darle perspectiva 3d
          rotateX: view === 'home' ? 0 : -20, //Rota para darle perspectiva 3d
          opacity: view === 'home' ? 1 : 0, //opacidad
        }}
        transition={{ type: "spring", stiffness: 70, damping: 20, mass: 1 }} //el tipo de animacion con su ligerez, tension y peso 
      >
        <nav className="corner-nav">
          <button 
            onClick={() => setView('anim')} 
            className="corner-btn top-left"
          >
            <img src="src/assets/ae.png" className="logo-hover" alt="AE" />
            <span className="text-button">Animación</span>
          </button>

          <button 
            onClick={() => setView('web')} 
            className="corner-btn bottom-left"
          >
            <img src="src/assets/react.webp" className="logo-hover" alt="AE" />
            <span className="text-button">Web Site</span>
          </button>

          <button 
            onClick={() => setView('games')} 
            className="corner-btn top-right"
          >
            <img src="src/assets/blender.png" className="logo-hover" alt="AE" />
            <span className="text-button">Videogames</span>
          </button>

          <button 
            onClick={() => setView('video')} 
            className="corner-btn bottom-right"
          >
            <img src="src/assets/premiere.png" className="logo-hover" alt="AE" />
            <span className="text-button">Edit Videos</span>
          </button>

        </nav>

        <header className="header-portfolio">
          <h1 className="title">Welcome to my Website Portfolio</h1>
          <img src="src/assets/NicoSonreir.png" alt="Nicolas Uribe" className="profile-img" />
          <h2 className="profile-name">Jaime Nicolas Uribe Arango</h2>
          <h3 className="studies">Multimedia Engineering</h3>
          <button className="button-contact">Contact Me</button>
        </header>
      </Motion.div>
    </main>
  )
}

export default App