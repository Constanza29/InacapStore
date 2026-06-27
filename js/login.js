// js/login.js - Validación y Autenticación de Usuarios

document.getElementById("form-login").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que la página se recargue

    const correo = document.getElementById("login-correo").value.trim();
    const password = document.getElementById("login-password").value;
    const alerta = document.getElementById("alerta-login");

    alerta.innerHTML = ""; // Limpiar mensajes previos

    // 1. Validar que ningún campo se encuentre vacío
    if (!correo || !password) {
        mostrarErrorLogin("Todos los campos son obligatorios.");
        return;
    }

    // 2. Buscar la lista de usuarios en LocalStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // 3. Verificar que el correo y la contraseña correspondan a un usuario registrado
    const usuarioEncontrado = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase() && u.password === password);

    if (usuarioEncontrado) {
        // --- CREDENCIALES CORRECTAS ---
        
        // Guardamos la sesión activa en LocalStorage (Solo datos necesarios, sin la contraseña por seguridad)
        const sesionUsuario = {
            nombre: usuarioEncontrado.nombre,
            correo: usuarioEncontrado.correo
        };
        localStorage.setItem("usuarioActivo", JSON.stringify(sesionUsuario));

        // Mostrar mensaje de éxito manipulando el DOM
        alerta.innerHTML = `
            <div class="alert alert-success" role="alert">
                <strong>¡Acceso correcto!</strong> Bienvenido de nuevo. Redireccionando...
            </div>
        `;

        // Redireccionar automáticamente a la página principal (index.html) tras 1.5 segundos
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } else {
        // --- CREDENCIALES INCORRECTAS ---
        mostrarErrorLogin("El correo electrónico o la contraseña son inválidos.");
    }
});

function mostrarErrorLogin(mensaje) {
    const alerta = document.getElementById("alerta-login");
    alerta.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}