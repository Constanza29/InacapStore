// js/init.js - Configuración Inicial y Menú Dinámico Global

// 1. Carga inicial de datos en LocalStorage (Tus productos)
const productosIniciales = [
    { id: 1, nombre: "Audífonos Bluetooth", precio: 25000, stock: 5, categoria: "Audio", descripcion: "Audífonos inalámbricos con cancelación de ruido.", imagenes: ["assets/audifonos1.png", "assets/audifonos2.png"] },
    { id: 2, nombre: "Teclado Mecánico", precio: 45000, stock: 3, categoria: "Periféricos", descripcion: "Teclado mecánico RGB switch red.", imagenes: ["assets/teclado1.png", "assets/teclado2.png"] },
    { id: 3, nombre: "Mouse Gamer", precio: 15000, stock: 4, categoria: "Periféricos", descripcion: "Mouse ergonómico de 6400 DPI.", imagenes: ["assets/mouse1.png", "assets/mouse2.png"] },
    { id: 4, nombre: "Monitor 24 pulgadas", precio: 120000, stock: 3, categoria: "Monitores", descripcion: "Monitor IPS Full HD 144Hz.", imagenes: ["assets/monitor1.png", "assets/monitor2.png"] },
    { id: 5, nombre: "Silla Gamer", precio: 95000, stock: 6, categoria: "Mobiliario", descripcion: "Silla ergonómica reclinable.", imagenes: ["assets/silla1.png", "assets/silla2.png"] },
    { id: 6, nombre: "Parlante Bluetooth", precio: 35000, stock: 4, categoria: "Audio", descripcion: "Parlante portátil resistente al agua.", imagenes: ["assets/parlante1.png", "assets/parlante2.png"] }
];

// Solo cargar si no existen previamente
if (!localStorage.getItem('productos')) {
    localStorage.setItem('productos', JSON.stringify(productosIniciales));
}
if (!localStorage.getItem('carrito')) {
    localStorage.setItem('carrito', JSON.stringify([]));
}

// 2. Renderizar Menú de Navegación según el Estado de la Sesión
function renderizarMenu() {
    const menu = document.getElementById("menu-navegacion");
    if (!menu) return; // Si la página actual no usa este menú dinámico, no hace nada

    // Recuperamos la sesión activa desde LocalStorage
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    
    // Obtenemos el nombre de la página actual para marcar la pestaña activa
    const paginaActual = window.location.pathname.split('/').pop() || 'index.html';

    let htmlMenu = `
        <li class="nav-item"><a class="nav-link ${paginaActual === 'index.html' ? 'active fw-bold text-primary' : ''}" href="index.html">Inicio</a></li>
        <li class="nav-item"><a class="nav-link ${paginaActual === 'catalogo.html' ? 'active fw-bold text-primary' : ''}" href="catalogo.html">Catálogo</a></li>
        <li class="nav-item"><a class="nav-link ${paginaActual === 'contacto.html' ? 'active fw-bold text-primary' : ''}" href="contacto.html">Contacto</a></li>
    `;

    if (usuarioActivo) {
        // Estado: Usuario Logueado
        htmlMenu += `
            <li class="nav-item d-flex align-items-center ms-lg-3 my-2 my-lg-0">
                <span class="navbar-text fw-bold text-dark me-3">Bienvenido, ${usuarioActivo.nombre}</span>
            </li>
            <li class="nav-item">
                <button class="btn btn-outline-danger btn-sm fw-bold px-3 py-1.5" id="btn-cerrar-sesion">Cerrar sesión</button>
            </li>
        `;
    } else {
        // Estado: Visitante Anónimo
        htmlMenu += `
            <li class="nav-item ms-lg-2"><a class="nav-link ${paginaActual === 'login.html' ? 'active fw-bold text-primary' : ''}" href="login.html">Iniciar sesión</a></li>
            <li class="nav-item ms-lg-1"><a class="btn btn-primary btn-sm fw-bold text-white px-3 py-1.5 mt-1 mt-lg-0" href="registro.html">Registrarse</a></li>
        `;
    }

    // Inyectamos las opciones dinámicas de forma segura en el DOM
    menu.innerHTML = htmlMenu;

    // Control Seguro del evento Cerrar Sesión
    const btnCerrar = document.getElementById("btn-cerrar-sesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.removeItem("usuarioActivo");
            window.location.href = "index.html";
        });
    }
}

// Ejecución segura asegurando que el DOM esté completamente cargado
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderizarMenu);
} else {
    renderizarMenu();
}