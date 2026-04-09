import FloatingLight from './FloatingLight';
import { motion as Motion, AnimatePresence } from 'framer-motion'; //Importacion de animacion
import React, { useState, useRef } from 'react' // importar el react
import './App.css';


function App() {

  const [view, setView] = useState('home'); // 'home', 'anim', 'web', 'video', 'games'
  const containerRef = useRef(null);

  //********************* Mapping de las posiciones de los botones*********************
  const viewConfig = {
    anim: { x: 800, y: 600 },
    web: { x: 800, y: -600 },
    games: { x: -800, y: 600 },
    video: { x: -800, y: -600 },
    home: { x: 0, y: 0 }
  };

  //*********************Insercion de los archivos multimedia*********************
  const projectsData = {
    anim: [
      { id: 1, title: "Luces animation", type: "embed", src: "src/assets/chicharron_preview.webm" }
    ]
  }

  //********************* Logos para transiciones *********************
  const logoAssets = {
    anim: "src/assets/ae.png",
    web: "src/assets/react.webp",
    games: "src/assets/blender.png",
    video: "src/assets/premiere.png"
  };

  //*********************Configuracion de botones*********************
  const backBtnConfig = {
    anim: { bottom: '40px', right: '40px', top: 'auto', left: 'auto' }, // Esquina Inferior Derecha
    web: { top: '40px', right: '40px', bottom: 'auto', left: 'auto' }, // Esquina Superior Derecha
    games: { bottom: '40px', left: '40px', top: 'auto', right: 'auto' }, // Esquina Inferior Izquierda
    video: { top: '40px', left: '40px', bottom: 'auto', right: 'auto' }, // Esquina Superior Izquierda
  };

  //*********************Animacion para cuando se acerque el mouse al boton*********************
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

  //*********************Animacion de letras*********************
  const AnimatedText = ({ text, className }) => {
    // Dividimos la frase en letras individuales
    const letters = Array.from(text);

    // Variantes para el contenedor (maneja el retraso entre letras)
    const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
      }),
    };

    // Variantes para cada letra individual (el movimiento)
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
        y: 20, // Empiezan un poco abajo
      },
    };

    return (
      <Motion.div
        style={{ display: "flex", overflow: "hidden" }}
        variants={container}
        initial="hidden"
        animate="visible"
        className={className}
      >
        {letters.map((letter, index) => (
          <Motion.span variants={child} key={index}>
            {letter === " " ? "\u00A0" : letter}
          </Motion.span>
        ))}
      </Motion.div>
    );
  };

  //*********************Secciones*********************
  const AnimationSection = () => (
    <Motion.div
      className="section-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <AnimatedText 
      text="Motion Graphics & After Effects" 
      className="section-title" />

      <p className="section-description">
        Exploración de ritmo, color y movimiento. Aquí verás mis trabajos de composición 2D y 3D.
      </p>

      <div className="projects-grid">
        {/* Aquí irán tus videos de AE */}
        <div className="video-card">Video 1</div>
        <div className="video-card">Video 2</div>
      </div>

      <button className="special-btn">Ver Reel Completo</button>
    </Motion.div>
  );

  return (
    <main className="main-layout">
      {/* Circles- Animando*/}
      <FloatingLight color="#a14d26" size="400px" duration={10} />
      <FloatingLight color="#455a64" size="300px" duration={15} />
      <FloatingLight color="#827717" size="500px" duration={20} />

      {/* Logo Invisible - Animacion  */}
      <AnimatePresence mode="sync">
        {view !== 'home' && (
          <Motion.img
            key={`logo-${view}`}
            src={logoAssets[view]}
            className="watermark-master"
            initial={{
              // Usamos coordenadas exactas e invertidas para eliminar el desfase
              x: -viewConfig[view].x,
              y: -viewConfig[view].y,
              scale: 0, //escala inicial
              opacity: 0 //opacidad inicial
            }}
            animate={{
              x: 0, // Posicion Final
              y: 0,
              scale: 6, // Lower scale + Fixed CSS size = More stability. ademas escala final
              opacity: 0.2,
            }}
            exit={{ opacity: 0, scale: 8 }}
            transition={{
              type: "spring",
              stiffness: 90, // Mayor tensión para que inicie de inmediato
              damping: 20,   // Amortiguación equilibrada para evitar rebote excesivo
              mass: 0.5,     // Menos masa = menor inercia inicial
              restDelta: 0.001
            }}
          />
        )}
      </AnimatePresence>

      {/* Boton Regreso Invisible - Animacion  */}
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

      {/* Navegacion HOME */}
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
          <img src="src/assets/Portada.png" alt="Nicolas Uribe" className="profile-img" />
          <h2 className="profile-name">Jaime Nicolas Uribe Arango</h2>
          <h3 className="studies">Multimedia Engineering</h3>
          <button className="button-contact">Contact Me</button>
        </header>
      </Motion.div>

      <AnimatePresence mode="wait">
        {view === 'anim' && <AnimationSection key="anim" />}
        {/*view === 'video' && <VideoSection key="video" />*/}
        {/* Aquí puedes seguir agregando las demás: web, games... */}
      </AnimatePresence>

    </main>
  )


}

export default App