import React, { useState, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import FloatingLight from './FloatingLight';
import AnimatedText from './AnimatedText';
import { useMouseProximity } from './Hooks/useMouseProximity';
import './App.css';


function App() {

  const [view, setView] = useState('home'); // 'home', 'anim', 'web', 'video', 'games'
  const containerRef = useRef(null);

  // 1. NUEVO: La memoria fotográfica del último botón tocado
  const lastClicked = useRef('anim');

  // 2. NUEVO: Función inteligente para cambiar de vista sin olvidar
  const handleChangeView = (newView) => {
    if (newView !== 'home') {
      lastClicked.current = newView; // Guarda el nombre de la esquina antes de viajar
    }
    setView(newView);
  };

  //********************* Config: Nacimiento del Logo *********************
  // El logo nace exactamente en la esquina del botón que tocaste
  const logoSpawnConfig = {
    anim: { x: "-42vw", y: "-42vh" },
    web: { x: "-42vw", y: "42vh" },
    games: { x: "42vw", y: "-42vh" },
    video: { x: "42vw", y: "42vh" },
    home: { x: 0, y: 0 }
  };

  //********************* Config: Huida de la Burbuja *********************
  // La burbuja huye hacia la esquina opuesta para dejar espacio
  const bubbleExitConfig = {
    anim: { x: 0, y: "-100vh" }, // <-- x en 0 obliga a que sea solo vertical
    games: { x: 0, y: "-100vh" },
    web: { x: 0, y: "100vh" },
    video: { x: 0, y: "100vh" },
    home: { x: 0, y: 0 }
  };

  // ********************* Físicas de Animación Global *********************
  // Fisica1
  const sharedTransition = {
    type: "spring",
    stiffness: 70,
    damping: 14, // Al bajar el damping, el logo hace un mini "rebote" al caer
    mass: 1.2
  };

  //Fisica2
  const sharedTransition2 = {
    type: "spring",
    stiffness: 85,
    damping: 20,
    mass: 0.8,
    restDelta: 0.001
  };

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
  const handleMouseMove = useMouseProximity(containerRef, view);

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
      <Motion.div
        className="camera-parallax-bg"
        initial={false}
        animate={{
          x: 0,
          y: 0, // Cero movimiento en Y para no marear
          scale: view !== 'home' ? 1.05 : 1, // Solo un ligero zoom de impacto
        }}
        transition={sharedTransition}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      >

      </Motion.div>

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
              x: logoSpawnConfig[view].x,
              y: logoSpawnConfig[view].y,
              // 2. Escala 0.6 hace que mida exactamente 60px, igual que tu logo del botón
              scale: 0.6,
              opacity: 1
            }}
            animate={{
              x: 0, // Posicion Final
              y: 0,
              scale: 6, // Lower scale + Fixed CSS size = More stability. ademas escala final
              opacity: 0.2,
            }}
            exit={{
              x: logoSpawnConfig[lastClicked.current].x,
              y: logoSpawnConfig[lastClicked.current].y,
              scale: 0.6, // Se encoge de nuevo al tamaño del botón
              opacity: 0  // Se desvanece justo al llegar
            }}
            transition={sharedTransition}
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
            onClick={() => handleChangeView('home')}
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
          x: bubbleExitConfig[view]?.x ?? 0,
          y: bubbleExitConfig[view]?.y ?? "0vh",
          scale: view === 'home' ? 1 : 0.1, //Escala el home(Burbuja)
          rotateY: view === 'home' ? 0 : 45, //Rota para darle perspectiva 3d
          rotateX: view === 'home' ? 0 : -20, //Rota para darle perspectiva 3d
          opacity: view === 'home' ? 1 : 0, //opacidad
        }}
        transition={sharedTransition} //el tipo de animacion con su ligerez, tension y peso 
      >
        <nav className="corner-nav">
          <button
            onClick={() => handleChangeView('anim')}
            className="corner-btn top-left"
          >
            <img
              src="src/assets/ae.png"
              className="logo-hover"
              alt="AE"
              // AQUÍ EL TRUCO: Si la vista no es home, se vuelve invisible al instante
              style={{ opacity: view === 'home' ? 1 : 0 }} />
            <span className="text-button">Animación</span>
          </button>

          <button
            onClick={() => handleChangeView('web')}
            className="corner-btn bottom-left"
          >
            <img
              src="src/assets/react.webp"
              className="logo-hover"
              alt="AE"
              style={{ opacity: view === 'home' ? 1 : 0 }}
            />
            <span className="text-button">Web Site</span>
          </button>

          <button
            onClick={() => handleChangeView('games')}
            className="corner-btn top-right"
          >
            <img
              src="src/assets/blender.png"
              className="logo-hover"
              alt="AE"
              style={{ opacity: view === 'home' ? 1 : 0 }} />
            <span className="text-button">Videogames</span>
          </button>

          <button
            onClick={() => handleChangeView('video')}
            className="corner-btn bottom-right"
          >
            <img
              src="src/assets/premiere.png"
              className="logo-hover"
              alt="AE"
              style={{ opacity: view === 'home' ? 1 : 0 }} />
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