import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../styles/agregar.css';
import ParticlesBackground from "../components/ParticlesBackground";


const BASE_API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const NOVEDADES_API_URL = `${BASE_API_URL}/admin/novedades`;

export default function NovedadesAgregar({ isEdit = false }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
   
    const [novedad, setNovedad] = useState({
        titulo: '',
        subtitulo: '',
        cuerpo: '',
        img_id: '',       
        imagen_url: ''   
    });
    
    const [imagenFile, setImagenFile] = useState(null); 
    const [borrarImagen, setBorrarImagen] = useState(false); 

    const { id } = useParams(); 
    const navigate = useNavigate();
    const token = sessionStorage.getItem('adminToken');



    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (isEdit && id) {
            setLoading(true);
            const fetchNovedad = async () => {
                try {
                    const response = await axios.get(`${NOVEDADES_API_URL}/modificar/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                   
                    setNovedad(prev => ({
                        ...prev,
                        ...response.data,
                      
                        imagen_url: response.data.imagen_url || response.data.imagen || '' 
                    })); 
                    
                } catch (err) {
                    console.error("Error al cargar la novedad para modificar:", err);
                    setError("No se pudo cargar la novedad. Verifique ID o conexión.");
                } finally {
                    setLoading(false);
                }
            };
            fetchNovedad();
        }

    }, [isEdit, id, navigate, token]);

 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovedad(prevNovedad => ({
            ...prevNovedad,
            [name]: value
        }));
    };
    

    const handleFileChange = (e) => {
        setImagenFile(e.target.files[0]);
        setBorrarImagen(false); 
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');
        
  
        if (!novedad.titulo || !novedad.subtitulo || !novedad.cuerpo) {
            setError('Todos los campos de texto son obligatorios (Título, Subtítulo, Cuerpo).');
            return;
        }

        setLoading(true);
        
        const formData = new FormData();

        formData.append('titulo', novedad.titulo);
        formData.append('subtitulo', novedad.subtitulo);
        formData.append('cuerpo', novedad.cuerpo);

        if (imagenFile) {
        
            formData.append('imagen', imagenFile); 
        }

        if (isEdit) {
         
            formData.append('id', id); 
            formData.append('img_original', novedad.img_id || ''); 
            
       
            const urlToKeep = !imagenFile && !borrarImagen ? (novedad.imagen_url || '') : '';
            formData.append('imagen_url_original', urlToKeep); 
        }


        try {
            let response;
            const config = {
                headers: { 
                    Authorization: `Bearer ${token}`,
                }
            };

            const endpoint = isEdit ? `${NOVEDADES_API_URL}/modificar` : `${NOVEDADES_API_URL}/agregar`;

            response = await axios.post(endpoint, formData, config);
            
            if (isEdit) {
                setSuccessMessage('Novedad modificada con éxito.');
            } else {
                setSuccessMessage('Novedad agregada con éxito.');
                

                setNovedad({ titulo: '', subtitulo: '', cuerpo: '', img_id: '', imagen_url: '' });
                setImagenFile(null); 
            }
            

            setTimeout(() => navigate('/admin/novedades'), 2000);

        } catch (err) {
            console.error(`Error al ${isEdit ? 'modificar' : 'agregar'} la novedad:`, err.response ? err.response.data : err.message);
            const backendError = err.response?.data?.message || 'Error desconocido al comunicarse con el servidor.';
            setError(`Error en la operación: ${backendError}`);
        } finally {
            setLoading(false);
        }
    };


    const titleText = isEdit ? `Modificar Novedad #${id || ''}` : 'Agregar Nueva Novedad';
    
    if (loading && isEdit && !novedad.titulo) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="text-center text-xl font-semibold text-indigo-600">
                    Cargando datos para edición...
                </div>
            </div>
        );
    }


    return (
        <div className="cuerpo-a">
            <div className="w-full max-w-2xl  rounded-xl shadow-2xl p-8">
              
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 border-b-2 border-indigo-500 pb-2">
                    {titleText}
                </h2>

                <div className="text">
                    <Link 
                        to="/admin/novedades" 
                        className="text"
                    >
                        &larr; Volver al Panel
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm" role="alert">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm" role="alert">
                        {successMessage}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}> 
                    
                   
                    <div>
                        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título Principal</label>
                        <input
                            id="titulo" name="titulo" type="text" required
                            value={novedad.titulo} onChange={handleChange}
                            className="campo"
                            placeholder="Título de la Novedad" disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="subtitulo" className="block text-sm font-medium text-gray-700">Subtítulo / Bajada</label>
                        <input
                            id="subtitulo" name="subtitulo" type="text" required
                            value={novedad.subtitulo} onChange={handleChange}
                            className="campo"
                            placeholder="Frase corta que describe la novedad" disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="cuerpo" className="block text-sm font-medium text-gray-700">Cuerpo del Contenido</label>
                        <textarea
                            id="cuerpo" name="cuerpo" required rows="6"
                            value={novedad.cuerpo} onChange={handleChange}
                            className="campo"
                            placeholder="El contenido completo y detallado de la novedad." disabled={loading}
                        />
                    </div>
                    
                    <ParticlesBackground />
             
                    <div>
                        <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
                            Seleccionar Imagen (Archivo desde PC)
                        </label>
                        <input
                            id="imagen"
                            name="imagen" 
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="text"
                            disabled={loading}
                        />
                    </div>

                    {isEdit && novedad.imagen_url && !imagenFile && (
                        <div className="border border-gray-200 p-4 rounded-lg">
                            <h4 className='text-sm font-semibold mb-1'>Imagen Actual:</h4>
                            <img 
                                src={novedad.imagen_url} 
                                alt="Vista previa actual" 
                                className="max-h-1 w-auto object-cover rounded-lg shadow-md mb-3" 
                            />
                            
                            <div className="flex items-center">
                                <input
                                    id="borrarImagen"
                                    type="checkbox"
                                    checked={borrarImagen}
                                    onChange={(e) => setBorrarImagen(e.target.checked)}
                                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    disabled={loading}
                                />
                                <label htmlFor="borrarImagen" className="ml-2 block text-sm text-red-600">
                                    Marcar para eliminar la imagen actual (No se subirá nueva)
                                </label>
                            </div>
                        </div>
                    )}
                    
                   
                    {imagenFile && (
                        <div className="imagen">
                            <h4 className='texto'>Nueva Imagen a Subir:</h4>
                            <p className="imagen-1">{imagenFile.name}</p>
                            <img 
                             
                                src={URL.createObjectURL(imagenFile)} 
                                alt="Previsualización de nuevo archivo" 
                                className="imagen-2" 
                            />
                            <p className="texto">Esta imagen reemplazará a la actual.</p>
                        </div>
                    )}


                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : (isEdit ? 'Guardar Cambios' : 'Crear Novedad')}
                    </button>
                </form>

            </div>
        </div>
    );
}