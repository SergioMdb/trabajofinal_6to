import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
    const particlesInit = async (engine) => {
    // cargamos solo lo necesario
    await loadSlim(engine);
    };

    return (
    <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
        background: { color: { value: "#000000" } },
        fpsLimit: 60,
        interactivity: {
            events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
            },
            modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { quantity: 4 },
            },
        },
        particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: "#55e508ff" },
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 5 } },
            links: {
            enable: true,
            distance: 150,
            color: "#2ee712ff",
            opacity: 0.4,
            width: 1,
            },
            move: {
            enable: true,
            speed: 2,
            outModes: { default: "bounce" },
            },
        },
        detectRetina: true,
        }}
    />
    );
}
