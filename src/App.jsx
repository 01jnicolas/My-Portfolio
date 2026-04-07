import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef } from 'react'
import './App.css';


function App() {

  const [view, setView] = useState('home'); // 'home', 'anim', 'web', 'video', 'games'
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

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

      <div className="bubble-container" ref={containerRef} onMouseMove={handleMouseMove}>
        {/* Buttoms - Ahora anclados al contenedor */}
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

      </div>
    </main>
  )
}

export default App