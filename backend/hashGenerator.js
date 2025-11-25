const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Carga las variables de entorno
dotenv.config();

// La contraseña que queremos hashear
const password = '123456'; 
// Número recomendado de rondas de salting para seguridad
const saltRounds = 10; 

async function generateHash() {
    try {
        console.log(`Generando hash para la contraseña: "${password}"...`);
        
        // Generar el hash de forma asíncrona
        const hash = await bcrypt.hash(password, saltRounds);

        console.log("-----------------------------------------------------------------");
        console.log("✅ HASH GENERADO CON ÉXITO:");
        console.log(`\n${hash}\n`);
        console.log("-----------------------------------------------------------------");
        console.log("INSTRUCCIONES:");
        console.log("1. Copia el hash (la cadena que empieza con $2a$).");
        console.log("2. Pégalo directamente en el campo 'password' de tu tabla 'usuarios' para el usuario 'admin'.");
        console.log("3. Luego, intenta iniciar sesión con 'admin' y la contraseña '123456'.");
        
    } catch (error) {
        console.error("Error al generar el hash:", error);
    }
}

generateHash();