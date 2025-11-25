import React, { useState } from "react";

import ParticlesBackground from "../components/ParticlesBackground";
import { Link } from "react-router-dom";

export default function Contact() {
    const [enviado, setEnviado] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const data = new FormData(e.target);

        const response = await fetch("https://formspree.io/f/xblyekbo", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        });

        if (response.ok) {
        setEnviado(true);
        e.target.reset();
        } else {
        throw new Error("Error al enviar el formulario");
        }
    } catch (err) {
        alert("Hubo un error al enviar el mensaje. " + err.message);
    } finally {
        setLoading(false);
    }
    };

    return (
    <>
        <ParticlesBackground />
    
        <header>
        <div className="holder">
        
            <h1>Hardware white</h1>
        </div>

        <nav>
            <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            </ul>
        </nav>
        </header>

        <main className="holder">
        <section className="holder contacto">
            <h2>Contactame</h2>
            <p>Dejá tu mensaje y te respondo por correo 📧</p>

            {!enviado ? (
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="_captcha" value="false" />

                <label htmlFor="nombre">Nombre completo</label>
                <input type="text" id="nombre" name="nombre" required />

                <label htmlFor="email">Correo electrónico</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="mensaje">Mensaje</label>
                <textarea id="mensaje" name="message" rows="5" required></textarea>

                <button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar"}
                </button>
            </form>
            ) : (
            <div id="mensaje-enviado" style={{ textAlign: "center", marginTop: 30 }}>
                <h3 style={{ color: "#2c6e49" }}>✅ ¡Gracias por tu mensaje!</h3>
                <p>En breve me pondré en contacto con vos.</p>
                <Link to="/">Volver al inicio</Link>
            </div>
            )}
        </section>
        </main>

        <footer>
        <p>&copy; 2025 Hardware white. Todos los derechos reservados.</p>
        </footer>
    </>
    );
}
