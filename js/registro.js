// js/registro.js - Lógica y Validaciones del Formulario de Registro Seguro

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-registro");
    
    if (!formulario) {
        console.error("Error: No se encontró el formulario #form-registro en esta página.");
        return;
    }

    formulario.addEventListener("submit", function(event) {
        // 1. Detener el envío automático para que no se recargue la página
        event.preventDefault(); 

        // 2. Captura de datos de los inputs
        const nombre = document.getElementById("reg-nombre").value.trim();
        const correo = document.getElementById("reg-correo").value.trim();
        const password = document.getElementById("reg-password").value;
        const passwordConfirm = document.getElementById("reg-password-confirm").value;

        // 3. Validación: Ningún campo puede quedar vacío
        if (!nombre || !correo || !password || !passwordConfirm) {
            mostrarMensajeError("Todos los campos son obligatorios y no pueden quedar vacíos.");
            return;
        }

        // 4. Validación: Formato de correo electrónico válido
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            mostrarMensajeError("Por favor, ingresa un formato de correo electrónico válido (ejemplo@dominio.com).");
            return;
        }

        // Recuperar la lista de usuarios ya registrados en LocalStorage
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // 5. Validación: El correo no puede estar duplicado
        const correoExiste = usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase());
        if (correoExiste) {
            mostrarMensajeError("Este correo electrónico ya se encuentra registrado.");
            return;
        }

        // 6. Validación: Largo mínimo de la contraseña (8 caracteres)
        if (password.length < 8) {
            mostrarMensajeError("La contraseña debe contener como mínimo 8 caracteres.");
            return;
        }

        // 7. Validación de complejidad (Mayúscula, Minúscula, Número y Símbolo)
        const tieneMayuscula = /[A-Z]/.test(password);
        const tieneMinuscula = /[a-z]/.test(password);
        const tieneNumero = /[0-9]/.test(password);
        const tieneSimbolo = /[^A-Za-z0-9]/.test(password);

        if (!tieneMayuscula || !tieneMinuscula || !tieneNumero || !tieneSimbolo) {
            mostrarMensajeError("La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo especial (ej: @, $, !, #).");
            return;
        }

        // 8. Validación: Que las dos contraseñas escritas sean idénticas
        if (password !== passwordConfirm) {
            mostrarMensajeError("La contraseña y la confirmación de contraseña no coinciden.");
            return;
        }

        // --- PROCESO DE REGISTRO EXITOSO ---
        const fechaActual = new Date().toISOString().split('T')[0];

        // Crear el objeto con la estructura exigida en la pauta
        const nuevoUsuario = {
            nombre: nombre,
            correo: correo,
            password: password,
            fechaCreacion: fechaActual
        };

        // Guardar el nuevo usuario en el arreglo de LocalStorage
        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        // Mostrar cuadro verde de éxito manipulando el DOM de forma segura
        const alerta = document.getElementById("alerta-registro");
        alerta.innerHTML = `
            <div class="alert alert-success" role="alert">
                <strong>¡Registro Exitoso!</strong> Tu cuenta ha sido creada con éxito. Redireccionando al inicio de sesión...
            </div>
        `;

        // Limpiar las cajas de texto del formulario
        this.reset();

        // Redirección automática a la pantalla de login tras 2 segundos
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    });
});

// Función modular para renderizar los errores en color rojo (Bootstrap alert-danger)
function mostrarMensajeError(mensaje) {
    const alerta = document.getElementById("alerta-registro");
    
    if (alerta) {
        alerta.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error de registro:</strong> ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        // Sube la pantalla automáticamente para que el usuario note el error de inmediato
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}