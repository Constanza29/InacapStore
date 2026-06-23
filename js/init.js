// js/init.js

// 1. Carga inicial de datos en LocalStorage
// js/init.js

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

// Destacar página activa en el menú
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active', 'fw-bold', 'text-primary');
        }
    });
});