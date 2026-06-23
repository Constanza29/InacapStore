// ==========================================
// 1. UTILIDADES
// ==========================================
function formatearDinero(valor) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
}

// ==========================================
// 2. RENDERIZAR PRODUCTOS (Con soporte de ofertas)
// ==========================================
function renderizarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return; 
    
    contenedor.innerHTML = ''; 

    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    productos.forEach(producto => {
        const agotado = producto.stock === 0;
        
        // -------------------------------------------------------------
        // DETECTOR DE OFERTAS INTELIGENTE
        // -------------------------------------------------------------
        let precioHTML = `<strong>Precio:</strong> ${formatearDinero(producto.precio)}`;
        let etiquetaOferta = '';

        // Detectar si es el Teclado Mecánico
        if (producto.nombre.toLowerCase().includes('teclado')) {
            const precioOriginal = 49990;
            const precioOferta = 34990;
            // Sobrescribimos temporalmente el precio para la lógica del carrito
            producto.precio = precioOferta; 
            
            etiquetaOferta = `<span class="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-pill small fw-bold" style="z-index: 10;">-30% Oferta</span>`;
            precioHTML = `<strong>Precio:</strong> <del class="text-muted small fw-normal">${formatearDinero(precioOriginal)}</del> <span class="text-danger fw-bold">${formatearDinero(precioOferta)}</span>`;
        } 
        // Detectar si son los Audífonos
        else if (producto.nombre.toLowerCase().includes('audífonos') || producto.nombre.toLowerCase().includes('audifonos')) {
            const precioOriginal = 79990;
            const precioOferta = 59990;
            // Sobrescribimos temporalmente el precio para la lógica del carrito
            producto.precio = precioOferta;
            
            etiquetaOferta = `<span class="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-pill small fw-bold" style="z-index: 10;">-25% Oferta</span>`;
            precioHTML = `<strong>Precio:</strong> <del class="text-muted small fw-normal">${formatearDinero(precioOriginal)}</del> <span class="text-danger fw-bold">${formatearDinero(precioOferta)}</span>`;
        }
        // -------------------------------------------------------------

        const carruselHTML = `
            <div id="carrusel-${producto.id}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="${producto.imagenes[0]}" class="card-img-top" alt="${producto.nombre} - 1">
                    </div>
                    <div class="carousel-item">
                        <img src="${producto.imagenes[1]}" class="card-img-top" alt="${producto.nombre} - 2">
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carrusel-${producto.id}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true" style="background-color: rgba(0,0,0,0.5); border-radius: 50%;"></span>
                    <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carrusel-${producto.id}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true" style="background-color: rgba(0,0,0,0.5); border-radius: 50%;"></span>
                    <span class="visually-hidden">Siguiente</span>
                </button>
            </div>
        `;

        const cardHTML = `
            <div class="col-md-6 mb-4 position-relative">
                <div class="card h-100 shadow-sm ${agotado ? 'border-danger' : ''}">
                    ${etiquetaOferta}
                    ${carruselHTML}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${producto.nombre}</h5>
                        <p class="card-text text-muted mb-1">${producto.descripcion}</p>
                        <p class="card-text mb-1">${precioHTML}</p>
                        <p class="card-text text-${agotado ? 'danger fw-bold' : 'success'}">
                            ${agotado ? '¡Agotado!' : `Stock disponible: ${producto.stock}`}
                        </p>
                        <button 
                            class="btn ${agotado ? 'btn-secondary disabled' : 'btn-primary'} mt-auto" 
                            onclick="agregarProducto(${producto.id})"
                            ${agotado ? 'disabled' : ''}>
                            ${agotado ? 'Sin Stock' : 'Agregar al Carrito'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

// ==========================================
// 3. RENDERIZAR CARRITO (Adaptada a tu Tabla HTML)
// ==========================================
function renderizarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    // Cambiado al ID real de tu HTML: 'cuerpo-carrito'
    const listaCarrito = document.getElementById('cuerpo-carrito'); 
    const totalCarrito = document.getElementById('total-carrito'); 

    if (!listaCarrito) return; 

    listaCarrito.innerHTML = '';
    let total = 0;

    // Mensaje si el carrito está vacío (adaptado para ocupar las 3 columnas de la tabla)
    if (carrito.length === 0) {
        listaCarrito.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-muted py-3">
                    El carrito está vacío
                </td>
            </tr>
        `;
        if (totalCarrito) totalCarrito.innerText = formatearDinero(0);
        return;
    }

    // Dibujar cada fila de la tabla
    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        
        const itemHTML = `
            <tr>
                <td>
                    <span class="fw-bold d-block">${producto.nombre}</span>
                    <small class="text-muted">${formatearDinero(producto.precio)} c/u</small>
                </td>
                
                <td>
                    <div class="d-flex align-items-center gap-1">
                        <button class="btn btn-sm btn-outline-secondary py-0 px-1" onclick="restarProducto(${producto.id})">-</button>
                        <span class="badge bg-primary">${producto.cantidad}</span>
                        <button class="btn btn-sm btn-danger py-0 px-1" onclick="eliminarDelCarrito(${producto.id})" title="Eliminar">
                            🗑️
                        </button>
                    </div>
                </td>
                
                <td class="text-end align-middle fw-bold">
                    ${formatearDinero(subtotal)}
                </td>
            </tr>
        `;
        listaCarrito.innerHTML += itemHTML;
    });

    // Actualizar el total de la compra (tu ID 'total-carrito' ya estaba perfecto)
    if (totalCarrito) {
        totalCarrito.innerText = formatearDinero(total);
    }
}
// ==========================================
// 4. LÓGICA DE STOCK Y CARRITO
// ==========================================
function agregarProducto(id) {
    console.log("1. Botón clickeado. ID recibido:", id);

    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let productoCatalogo = productos.find(p => p.id == id);
    
    if (!productoCatalogo) {
        console.error("Error: No se encontró el producto en el LocalStorage.");
        return;
    }

    if (productoCatalogo.stock <= 0) {
        console.warn("El producto ya no tiene stock.");
        return;
    }

    // -------------------------------------------------------------
    // ¡AQUÍ ESTÁ LA CORRECCIÓN! 
    // Forzamos el precio de oferta en la lógica del carrito antes de guardarlo
    // -------------------------------------------------------------
    if (productoCatalogo.nombre.toLowerCase().includes('teclado')) {
        productoCatalogo.precio = 34990; // Precio de oferta de la portada
    } else if (productoCatalogo.nombre.toLowerCase().includes('audífonos') || productoCatalogo.nombre.toLowerCase().includes('audifonos')) {
        productoCatalogo.precio = 59990; // Precio de oferta de la portada
    }
    // -------------------------------------------------------------

    let productoEnCarrito = carrito.find(p => p.id == id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
        // Nos aseguramos de que si ya existía en el carrito, también tenga el precio de oferta
        productoEnCarrito.precio = productoCatalogo.precio; 
        console.log("2. Producto ya estaba en carrito. Sumando cantidad con precio oferta.");
    } else {
        carrito.push({ ...productoCatalogo, cantidad: 1 });
        console.log("2. Producto nuevo agregado al carrito con precio oferta.");
    }

    // Restar el stock en el catálogo
    productoCatalogo.stock--;

    // Guardar en la memoria local
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log("3. Memoria actualizada con precios de oferta.");

    // Recargar la pantalla
    renderizarProductos();
    renderizarCarrito();
}

function restarProducto(id) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let indexCarrito = carrito.findIndex(item => item.id === id);
    let indexProducto = productos.findIndex(prod => prod.id === id);

    if (indexCarrito !== -1 && indexProducto !== -1) {
        if (carrito[indexCarrito].cantidad > 1) {
            carrito[indexCarrito].cantidad--;
            productos[indexProducto].stock++;
            
            localStorage.setItem('productos', JSON.stringify(productos));
            localStorage.setItem('carrito', JSON.stringify(carrito));
            
            renderizarCarrito();
            renderizarProductos(); 
        } else {
            eliminarDelCarrito(id);
        }
    }
}

function eliminarDelCarrito(id) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let indexCarrito = carrito.findIndex(item => item.id === id);
    let indexProducto = productos.findIndex(prod => prod.id === id);

    if (indexCarrito !== -1 && indexProducto !== -1) {
        productos[indexProducto].stock += carrito[indexCarrito].cantidad;
        carrito.splice(indexCarrito, 1);

        localStorage.setItem('productos', JSON.stringify(productos));
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        renderizarCarrito();
        renderizarProductos();
    }
}

// ==========================================
// 5. INICIALIZACIÓN (El motor de arranque)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    renderizarCarrito();
});