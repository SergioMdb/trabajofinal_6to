import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Link } from 'react-router-dom';
import '../styles/novedadViews.css';
import ParticlesBackground from "../components/ParticlesBackground";

const API_URL = "http://localhost:3000/api/novedades"; 


const NovedadItem = ({ titulo, subtitulo, cuerpo, imagen_url }) => {
   
    const placeholderUrl = "https://placehold.co/800x250/312e81/FFFFFF?text=Imagen+Novedad"; 
    const imageUrl = imagen_url || placeholderUrl; 
<ParticlesBackground />




    return (
        <div className="cuerpo-v">
        
            <div 
            
                className="cv"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                <div className="overay"></div>
                <div className="overay2">
                    <h3 className="titulo">{titulo}</h3>
                    <h4 className="subtitulo">{subtitulo}</h4>
                </div>
            </div>
            
           
            <div className="descripcion">
                <p className="cuerpoDescripcion">{cuerpo}</p>
            </div>
        </div>
    );
};

export default function NovedadesPage() {
    const [loading, setLoading] = useState(true);
    const [novedades, setNovedades] = useState([]); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNovedades = async () => {
            try {
                setLoading(true);
               
                await new Promise(resolve => setTimeout(resolve, 1000)); 

                const response = await axios.get(API_URL);
                
                if (Array.isArray(response.data)) {
                    setNovedades(response.data);
                } else {
                    throw new Error("La API no devolvió una lista de novedades.");
                }

            } catch (err) {
                console.error("Error al cargar novedades:", err);
                setError("Error al cargar las novedades. Asegúrate de que tu backend esté corriendo y la URL sea correcta: " + API_URL);
                
               
                setNovedades([
                    { id: 1, titulo: 'Error: PC Gamer', subtitulo: '¡Usando datos de prueba!', cuerpo: 'Datos de prueba si la API falla.', imagen_url: 'https://placehold.co/800x250/000000/FFFFFF?text=FALLA+API' },
                ]);

            } finally {
                setLoading(false);
            }
        };

        fetchNovedades();
    }, []); 

    return (
        
        <div className="trasparente">
            <ParticlesBackground />
           
            <header className="trasparente">
                <nav className="navbar navbar-expand-lg navbar-dark p-0 backdrop-blur-md bg-white/20">
                    <div className="container-fluid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <Link className="trasparente" to="/">
                            <div className="">
                                <h1>Hardware White</h1> 
                            </div>        
                        </Link>
                        
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNavNovedades"
                            aria-controls="navbarNavNovedades"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon !bg-gray-800"></span> 
                        </button>
                        
                        <div className="collapse navbar-collapse" id="navbarNavNovedades">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link className="nav-link text-gray-900 hover:text-indigo-600 transition" to="/">Inicio</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active text-indigo-600 font-semibold" aria-current="page" to="/novedades">Novedades</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-gray-900 hover:text-indigo-600 transition" to="/contacto">Contacto</Link>
                                </li>
                                <li className="nav-item">
                                    <a className="btn bg-indigo-600 text-white hover:bg-indigo-700 transition ms-2" href="/login">Registrarse</a> 
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
         


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center min-h-screen pt-[100px] pb-12">
                
         
                <h2 className="text-white font-extrabold text-gray-900 mb-8 border-b-4 border-indigo-500 pb-3">
                    Últimas Novedades
                </h2>

                {loading ? (
                    <div className="text-center py-10 text-xl font-semibold text-indigo-600">
                        Cargando... 
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">¡Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                        <p className="mt-2 text-sm">Mostrando contenido de prueba. Revisa la URL de tu API y el estado de tu backend.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {Array.isArray(novedades) && novedades.length > 0 ? (
                            novedades.map(novedad => (
                                <NovedadItem 
                                    key={novedad.id} 
                                    titulo={novedad.titulo} 
                                    subtitulo={novedad.subtitulo} 
                                    cuerpo={novedad.cuerpo} 
                                    imagen_url={novedad.imagen_url} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No hay novedades para mostrar en este momento.
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="">
                <ParticlesBackground />
                <p>&copy; 2025 Tu Empresa de Reparación de PC. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}