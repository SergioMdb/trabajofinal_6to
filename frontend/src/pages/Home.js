import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/miestilo.css'
import ParticlesBackground from "../components/ParticlesBackground";


export default function Home() {
    
    const [problemaActivo, setProblemaActivo] = useState(null);
    const [contactoActivo, setContactoActivo] = useState(null);

    const toggleProblema = (id) => {
    setProblemaActivo(problemaActivo === id ? null : id);
   
    setContactoActivo(null);
    };

    const toggleContacto = (id) => {
    setContactoActivo(contactoActivo === id ? null : id);
    };

    return (
    <>
    
     <ParticlesBackground />
        <main className="holder">
        <header>
   
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-transparent">
    <div className="container-fluid"> 
        <Link className="navbar-brand d-flex align-items-center" to="/">
    <div className="holder">
            <h1>Hardware White</h1> 
    </div>        
        </Link>

    
        <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        >
        <span className="navbar-toggler-icon"></span>
        </button>

    
        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
            <li className="nav-item">
            <Link className="nav-link" to="/">Inicio</Link>
            </li>
            
          
            <li className="nav-item">
            <Link className="nav-link" to="/novedades">Novedades</Link>
            </li>
       

            <li className="nav-item">
            <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
            <li className="nav-item">
         
            <a className="btn btn-success ms-2" href="/login">Registrarse</a> 

            </li>
        </ul>
        </div>
    </div>
    </nav>
</header>

        {/* 📌 Catálogo */}
        <section id="catalogo">
            <h2>Catálogo de Servicios</h2>
            <div className="catalogo-container">
            <article className="servicio">
            
                <img src="/logos/emsamble.jpg" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/000000/FFFFFF?text=PC+Build" }} alt="Ensamble de PC" className="servicio-img" />
                
                
                <h3>🛠️ Emsamble de PC</h3>
                <p>
                Armamos tu computadora con los mejores estándares, asegurando
                compatibilidad y rendimiento.
                </p>
            </article>

            <article className="servicio">
            
                <img src="/logos/mantenimiento.jpg" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/000000/FFFFFF?text=Maintenance" }} alt="Mantenimiento de PC" className="servicio-img" />
                
                
                <h3>🧽 Mantenimiento de PC</h3>
                <p>
                Limpieza física y software para mejorar la vida útil y velocidad
                de tu equipo.
                </p>
            </article>

            <article className="servicio">
           
                <img src="/logos/asesoria.png" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/000000/FFFFFF?text=Advice" }} alt="Asesoramiento" className="servicio-img" /> 
                
                
                <h3>💡 Asesoramiento</h3>
                <p>
                Te ayudamos a elegir componentes o resolver dudas antes de
                invertir.
                </p>
            </article>

            <article className="servicio">
         
                <img src="/logos/preguntas2.png" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/000000/FFFFFF?text=FAQ" }} alt="Problemas frecuentes" className="servicio-img" />
    
                <h3>🔧 Problemas Frecuentes</h3>
                <p>
                Diagnóstico y solución a errores comunes como pantallas azules o
                fallas de encendido.
                </p>
            </article>
            </div>
        </section>

        {/*  Problemas frecuentes */}
        <section id="identificar-problema">
            <h2>Identifica tu Problema</h2>
            <p>Seleccioná una opción para ver la solución:</p>

            <div className="opciones">
            {/*  No enciende */}
            <div className="opcion">
                <h3>🔌 No enciende</h3>
                <p>Tu computadora no da señales de vida.</p>
                <button onClick={() => toggleProblema(1)}>Ver solución</button>

                {problemaActivo === 1 && (
                <div className="solucion">
                    <p>
                    <strong>Posibles causas:</strong> fuente dañada, cables mal
                    conectados, botón de encendido o placa madre fallando.
                    </p>
                    <p>
                    <strong>Sugerencia:</strong> Verificá la fuente de poder,
                    cambiá el cable, o probá la placa madre con otra fuente.
                    </p>
                    <button
                    className="boton-secundario"
                    onClick={() => toggleContacto(1)}
                    >
                    ¿No funcionó?
                    </button>

                    {contactoActivo === 1 && (
                    <div className="contacto-extra">
                        <p>Podés contactarme directamente:</p>
                        <Link to="/contacto" className="btn-contacto">
                        📧 Gmail
                        </Link>
                        <a
                        href="https://wa.me/543772435138"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-contacto"
                        >
                        💬 WhatsApp
                        </a>
                    </div>
                    )}
                </div>
                )}
            </div>

            {/*  Funciona muy lenta */}
            <div className="opcion">
                <h3>🐢 Funciona muy lenta</h3>
                <p>Tu PC tarda mucho en arrancar o abrir programas.</p>
                <button onClick={() => toggleProblema(2)}>Ver solución</button>

                {problemaActivo === 2 && (
                <div className="solucion">
                    <p>
                    <strong>Causas comunes:</strong> disco lleno, programas en
                    segundo plano, malware, falta de limpieza.
                    </p>
                    <p>
                    <strong>Sugerencia:</strong> Desinstalá programas
                    innecesarios, revisá el administrador de tareas y hacé
                    limpieza física.
                    </p>
                    <button
                    className="boton-secundario"
                    onClick={() => toggleContacto(2)}
                    >
                    ¿No funcionó?
                    </button>

                    {contactoActivo === 2 && (
                    <div className="contacto-extra">
                        <p>Podés contactarme directamente:</p>
                        <Link to="/contacto" className="btn-contacto">
                        📧 Gmail
                        </Link>
                        <a
                        href="https://wa.me/543772435138"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-contacto"
                        >
                        💬 WhatsApp
                        </a>
                    </div>
                    )}
                </div>
                )}
            </div>

            {/* Enciende pero no da video */}
            <div className="opcion">
                <h3>🖥️ Enciende pero no da video</h3>
                <p>La PC prende pero no ves imagen en pantalla.</p>
                <button onClick={() => toggleProblema(3)}>Ver solución</button>

                {problemaActivo === 3 && (
                <div className="solucion">
                    <p>
                    <strong>Puede ser:</strong> problema de RAM, placa de video
                    mal conectada o monitor.
                    </p>
                    <p>
                    <strong>Sugerencia:</strong> Probá conectar otro monitor,
                    revisá la RAM y limpiá los contactos.
                    </p>
                    <button
                    className="boton-secundario"
                    onClick={() => toggleContacto(3)}
                    >
                    ¿No funcionó?
                    </button>

                    {contactoActivo === 3 && (
                    <div className="contacto-extra">
                        <p>Podés contactarme directamente:</p>
                        <Link to="/contacto" className="btn-contacto">
                        📧 Gmail
                        </Link>
                        <a
                        href="https://wa.me/543772435138"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-contacto"
                        >
                        💬 WhatsApp
                        </a>
                    </div>
                    )}
                </div>
                )}
            </div>

            {/*  Se sobrecalienta */}
            <div className="opcion">
                <h3>🔥 Se sobrecalienta</h3>
                <p>Tu PC se calienta mucho o se apaga sola.</p>
                <button onClick={() => toggleProblema(4)}>Ver solución</button>

                {problemaActivo === 4 && (
                <div className="solucion">
                    <p>
                    <strong>Causas:</strong> pasta térmica vieja, ventiladores
                    sucios o sin mantenimiento.
                    </p>
                    <p>
                    <strong>Sugerencia:</strong> Limpiá los ventiladores,
                    cambiá la pasta térmica y controlá la temperatura con
                    software.
                    </p>
                    <button
                    className="boton-secundario"
                    onClick={() => toggleContacto(4)}
                    >
                    ¿No funcionó?
                    </button>

                    {contactoActivo === 4 && (
                    <div className="contacto-extra">
                        <p>Podés contactarme directamente:</p>
                        <Link to="/contacto" className="btn-contacto">
                        📧 Gmail
                        </Link>
                        <a
                        href="https://wa.me/543772435138"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-contacto"
                        >
                        💬 WhatsApp
                        </a>
                    </div>
                    )}
                </div>
                )}
            </div>
            </div>
        </section>
        </main>

        <footer>
    
        <img src="/logos/logo_SB.png" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/000000/FFFFFF?text=Logo" }} width="100" height="100" alt="logo" />
        <p>&copy; 2025 Tu Empresa de Reparación de PC. Todos los derechos reservados.</p>
        </footer>
    </>
    );
}