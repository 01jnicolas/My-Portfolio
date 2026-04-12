import React, { useState, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import FloatingLight from './FloatingLight';
import AnimatedText from './AnimatedText';
import { useMouseProximity } from './Hooks/useMouseProximity';
import './App.css';

import assetAe from './assets/ae.png';
import assetReact from './assets/react.webp';
import assetBlender from './assets/blender.png';
import assetPremiere from './assets/premiere.png';
import assetPortadaGame from './assets/Portada-Game.png';
import assetCapturaWeb from './assets/Captura-Pagina-web.PNG';
import assetPortada from './assets/Portada.png';

function App() {

  const [view, setView] = useState('home'); // 'home', 'anim', 'web', 'video', 'games'
  const containerRef = useRef(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // 1. La memoria fotográfica del último botón tocado
  const lastClicked = useRef('anim');

  // 2. Función inteligente para cambiar de vista sin olvidar
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

  const backBtnConfig = {
    // Usamos el 32% del ancho y 40% del alto. Es la "proporción áurea" para que nunca toque los bordes.
    anim: { x: "32vw", y: "40vh" },  
    web: { x: "32vw", y: "-40vh" }, 
    games: { x: "-32vw", y: "40vh" },  
    video: { x: "-32vw", y: "-40vh" }, 
  };

  // ********************* Físicas de Animación Global *********************
  // Fisica1
  const sharedTransition = {
    type: "spring",
    stiffness: 70,
    damping: 14, // Al bajar el damping, el logo hace un mini "rebote" al caer
    mass: 1.2
  };

  //********************* Logos para transiciones *********************
  const logoAssets = {
    anim: assetAe,
    web: assetReact,
    games: assetBlender,
    video: assetPremiere,
  };

  //*********************Animacion para cuando se acerque el mouse al boton*********************
  const handleMouseMove = useMouseProximity(containerRef, view);

  //*********************Seccione Animacion*********************
  const animationVideos = [
    { id: 1, title: "Proyecto 1", url: "https://res.cloudinary.com/did2cfvzb/video/upload/v1775865520/TPJwyCZ2BKV_576_nr6zst.mp4", orientation: "portrait" },
    { id: 2, title: "Proyecto 2", url: "https://res.cloudinary.com/did2cfvzb/video/upload/v1775864795/Video_vqlcsu.mp4", orientation: "portrait" }, // Repetido para llenar la muestra
    { id: 3, title: "Proyecto 3", url: "https://res.cloudinary.com/did2cfvzb/video/upload/v1775864944/VideoOraculo3_pkouvg.mp4", orientation: "portrait" }, // Repetido para llenar la muestra
  ];

  const AnimationSection = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
      <Motion.div
        className="section-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <AnimatedText
          text="Motion Graphics & After Effects"
          className="section-title" />

        {/* LA CUADRÍCULA (GRID) */}
        <div className="projects-grid">
          {animationVideos.map((video) => (
            <Motion.div
              key={video.id}
              layoutId={`video-container-${video.id}`} // MAGIA: Conecta el cuadrito con la pantalla completa
              className="video-card"
              onClick={() => setSelectedVideo(video)}
              // MODIFICACIÓN AQUÍ: Animación suave de entrada para cada tarjeta de video
              initial={{
                opacity: 0,
                scale: 0.9
              }} // Comienza totalmente invisible
              animate={{
                opacity: 1,
                scale: 1
              }}  // Se vuelve visible suavemente al cargar la sección
              transition={{ duration: 1.5, ease: "easeOut" }} // Duración (1.5 segundos) y suavidad de la transición. Aumenta 'duration' si quieres que sea aún más suave y lenta.
              whileHover={{ scale: 1.05 }} // Se expande un poquitico al pasar el mouse
              whileTap={{ scale: 0.95 }}
            >
              {/* Video en miniatura: Sin controles, mudo, hace auto-play al pasar el mouse */}
              <video
                src={video.url}
                autoPlay    // 1. Le dice que arranque solo
                muted={true}       // 2. VITAL: Si no es mudo, Chrome/Safari lo bloquean
                loop        // 3. Para que se repita infinitamente
                playsInline // 4. Evita que el video se abra en pantalla completa en móviles
              />
            </Motion.div>
          ))}
        </div>

        {/* BOTÓN DE BEHANCE */}
        <Motion.a
          href="https://www.behance.net/JNicolasUA"
          target="_blank"             // Abre en una nueva pestaña
          rel="noopener noreferrer"   // Seguridad estándar de React para enlaces externos
          className="behance-btn"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }} // Entra un poquito después que los videos
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View more on Behance
        </Motion.a>

        {/* MODAL DE PANTALLA COMPLETA */}
        <AnimatePresence>
          {selectedVideo && (
            <Motion.div
              className="fullscreen-video-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)} // Si haces clic por fuera, se cierra
            >
              <Motion.div
                layoutId={`video-container-${selectedVideo.id}`} // MAGIA: Le dice que crezca desde el cuadrito
                className={`fullscreen-video-wrapper ${selectedVideo.orientation === 'landscape' ? 'modal-landscape' : 'modal-portrait'}`}
                onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic en los controles del video
              >
                {/* Video gigante: Con controles, arranca automáticamente */}
                <video
                  src={selectedVideo.url}
                  className="fullscreen-video-player"
                  controls
                  autoPlay
                />
                <button className="close-video-btn" onClick={() => setSelectedVideo(null)}>
                  ✕
                </button>
              </Motion.div>
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.div>
    );
  };
  //*********************Seccione Videojuegos*********************
  const GamesSection = () => (
    <Motion.div
      className="section-content games-section-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* TÍTULO */}
      <AnimatedText
        text="Developer Videogames"
        className="section-title" />

      {/* PÓSTER DEL PROYECTO */}
      <Motion.div
        className="game-poster-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <Motion.a
          href={"https://www.behance.net/gallery/242348059/Prototype-Smash-Bross"} // Usa la URL de Behance que definimos
          target="_blank"
          rel="noopener noreferrer"
          className="game-poster-link"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <img
            src={assetPortadaGame}
            alt="Prototype Smash Colombia Poster"
            className="game-poster-img"
          />
        </Motion.a>
      </Motion.div>

      {/* NUEVO: DESCRIPCIÓN DEL PROYECTO */}
      <Motion.p
        className="section-description game-description"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        An academic project developed for educational purposes. "Smash Bross" is a prototype exploring 3D modeling and character design—featuring the fighter "Chicharrón"—alongside the creation of environments and architectural assets inspired by Colombia.
      </Motion.p>

      {/* BOTÓN DE BEHANCE */}
      <Motion.div
        className="games-cta-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <Motion.a
          href={"https://www.behance.net/gallery/242348059/Prototype-Smash-Bross"}
          target="_blank"
          rel="noopener noreferrer"
          className="behance-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View more on Behance
        </Motion.a>
      </Motion.div>
    </Motion.div>
  );

  //********************* Datos de la Sección Edit Videos *********************
  const editVideosHorizontal = [
    // Cambiamos 'url' por 'videoId' y agregamos type: 'youtube'
    { id: 'eh1', type: 'youtube', videoId: "i__4WTdAsd0", orientation: "landscape" },
    { id: 'eh2', type: 'youtube', videoId: "62jw8Lrssmg", orientation: "landscape" },
  ];

  // Los verticales los dejamos intactos con tu mp4 de Cloudinary
  const editVideosVertical = [
    { id: 'ev1', type: 'mp4', url: "https://res.cloudinary.com/did2cfvzb/video/upload/v1775775629/reel2_1_elvh2b.mp4", orientation: "portrait" },
    { id: 'ev2', type: 'mp4', url: "https://res.cloudinary.com/did2cfvzb/video/upload/v1775775629/reel3_1_rlqxxb.mp4", orientation: "portrait" },
  ];

  const EditVideoSection = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
      <Motion.div
        className="section-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {/* TÍTULO Y DESCRIPCIÓN */}
        <AnimatedText text="Edit Videos" className="section-title" />

        {/* EL LAYOUT MAESTRO */}
        <div className="edit-videos-layout">

          {/* Columna Izquierda (Horizontales - Miniaturas) */}
          <div className="horizontal-column">
            {editVideosHorizontal.map((video) => (
              <Motion.div
                key={video.id}
                layoutId={`edit-video-${video.id}`}
                className="edit-video-card card-landscape"
                onClick={() => setSelectedVideo(video)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* AQUÍ VA LA MINIATURA (Usa "video.videoId", NO "selectedVideo") */}
                {video.type === 'youtube' ? (
                  <iframe
                    className="video-thumbnail"
                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.videoId}`}
                    style={{ border: 'none', pointerEvents: 'none' }}
                    allow="autoplay"
                  />
                ) : (
                  <video src={video.url} autoPlay muted={true} loop playsInline className="video-thumbnail" />
                )}
              </Motion.div>
            ))}
          </div>

          {/* Columna Derecha (Verticales - Miniaturas) */}
          <div className="vertical-column">
            {editVideosVertical.map((video) => (
              <Motion.div
                key={video.id}
                layoutId={`edit-video-${video.id}`}
                className="edit-video-card card-portrait"
                onClick={() => setSelectedVideo(video)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                <video src={video.url} autoPlay muted={true} loop playsInline className="video-thumbnail" />
              </Motion.div>
            ))}
          </div>

        </div>

        {/* BOTÓN DE BEHANCE */}
        <Motion.a
          href="https://www.behance.net/JNicolasUA"
          target="_blank"
          rel="noopener noreferrer"
          className="behance-btn"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View more on Behance
        </Motion.a>

        {/* MODAL INTELIGENTE (Reproductor Gigante) */}
        <AnimatePresence>
          {selectedVideo && (
            <Motion.div
              className="fullscreen-video-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
            >
              <Motion.div
                layoutId={`edit-video-${selectedVideo.id}`}
                className={`fullscreen-video-wrapper ${selectedVideo.orientation === 'landscape' ? 'modal-landscape' : 'modal-portrait'}`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* AQUÍ VA EL REPRODUCTOR GIGANTE (Usa "selectedVideo.videoId") */}
                {selectedVideo.type === 'youtube' ? (
                  <iframe
                    key={selectedVideo.videoId}
                    className="fullscreen-video-player"
                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                    title="YouTube video player"
                    style={{ border: 'none', width: '100%', height: '100%' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video src={selectedVideo.url} className="fullscreen-video-player" controls autoPlay />
                )}
                <button className="close-video-btn" onClick={() => setSelectedVideo(null)}>✕</button>
              </Motion.div>
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.div>
    );
  };

  //********************* Sección Web Design *********************
  const WebSection = () => (
    <Motion.div
      className="section-content web-section-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <AnimatedText
        text="Web Development"
        className="section-title" />

      {/* VISTA PREVIA DE ESTE MISMO SITIO */}
      <Motion.div
        className="game-poster-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="web-mockup-frame">
          <img
            src={assetCapturaWeb}
            alt="Este Portafolio"
            className="game-poster-img"
          />
        </div>
      </Motion.div>

      {/* DESCRIPCIÓN TÉCNICA */}
      <Motion.p
        className="section-description game-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <strong>Interactive Portfolio 2026:</strong> My first deep dive into Frontend Engineering.
        Developed from scratch using <strong>React</strong> and <strong>Framer Motion</strong>,
        focusing on creating a high-performance multimodal experience with smooth
        physics-based transitions.
      </Motion.p>

      {/* BOTÓN AL REPOSITORIO (Para mostrar que sabes programar) */}
      <Motion.div className="games-cta-container">
        <Motion.a
          href="https://github.com/01jnicolas/My-Portfolio" // Cuando lo subas a GitHub
          target="_blank"
          className="behance-btn"
          whileHover={{ scale: 1.05 }}
        >
          View Code on GitHub
        </Motion.a>
      </Motion.div>
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
          <div style={{
            position: 'fixed',
            inset: 0, /* Atajo pro para top:0, left:0, right:0, bottom:0 */
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none', /* Hace que este fondo invisible no bloquee los clics de tu sitio */
            zIndex: 1000
          }}>
            <Motion.button
              key="back-button"
              className="back-home-btn"
              style={{ 
                pointerEvents: 'auto', /* Reactiva el clic solo en el botón */
                whiteSpace: 'nowrap'
              }}
              /* Nace en el centro absoluto sin matemáticas raras */
              initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: backBtnConfig[view].x,
                y: backBtnConfig[view].y
              }}
              exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
              transition={sharedTransition}
              onClick={() => handleChangeView('home')}
            >
              <span className="back-full">← Back to Home</span>
              <span className="back-short">← Back</span>
            </Motion.button>
          </div>
        )}
      </AnimatePresence>
      
      {/* Navegacion HOME */}
      <Motion.div
        className="bubble-container"
        ref={containerRef}
        onMouseMove={(e) => {
          // Solo ejecutamos el radar de proximidad si es una pantalla grande (escritorio)
          if (window.innerWidth > 768) {
            handleMouseMove(e);
          }
        }}
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
              src={assetAe}
              className="logo-hover"
              alt="AE"
              style={{ opacity: view === 'home' ? 1 : 0 }} />
            <span className="text-button">Animation</span>
          </button>

          <button
            onClick={() => handleChangeView('web')}
            className="corner-btn bottom-left"
          >
            <img
              src={assetReact}
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
              src={assetBlender}
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
              src={assetPremiere}
              className="logo-hover"
              alt="AE"
              style={{ opacity: view === 'home' ? 1 : 0 }} />
            <span className="text-button">Edit Videos</span>
          </button>

        </nav>

        <header className="header-portfolio">
          <img src={assetPortada} alt="Nicolas Uribe" className="profile-img" />
          <h2 className="profile-name">Jaime Nicolas Uribe Arango</h2>
          <h3 className="studies">Multimedia Engineering</h3>
          <button
            className="button-contact"
            onClick={() => setIsContactOpen(true)}

          >Contact Me</button>
        </header>
      </Motion.div>

      <AnimatePresence mode="wait">
        {view === 'anim' && <AnimationSection key="anim" />}
        {view === 'games' && <GamesSection key="games" />}
        {view === 'video' && <EditVideoSection key="video" />}
        {view === 'web' && <WebSection key="web" />}
      </AnimatePresence>

      <AnimatePresence>
        {isContactOpen && (
          <Motion.div
            className="contact-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsContactOpen(false)} // Cierra al dar clic afuera
          >
            <Motion.div
              className="contact-modal"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Evita que se cierre al tocar el cuadro
            >
              <button className="close-contact-btn" onClick={() => setIsContactOpen(false)}>✕</button>

              <h2 className="modal-title">Get in Touch</h2>
              <p className="modal-subtitle">I'm currently looking for new opportunities. Let's build something amazing together!</p>

              <div className="contact-info-list">
                <div className="contact-item">
                  <span className="label">Email:</span>
                  <a href="mailto:01jnicolas@gmail.com" className="value">01jnicolas@gmail.com</a>
                </div>
                <div className="contact-item">
                  <span className="label">Location:</span>
                  <span className="value">Colombia, Antioquia (Colombia)</span>
                </div>
                <div className="contact-item">
                  <span className="label">LinkedIn:</span>
                  <a href="www.linkedin.com/in/jnicolasua" target="_blank" className="value">www.linkedin.com/in/jnicolasua</a>
                </div>
              </div>

              <div className="modal-footer">
                <p>Available for freelance and full-time roles.</p>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

    </main>
  )


}

export default App