// js/catalogo.js - Lógica del Catálogo con Ofertas, Gestión de Carrito y Filtros Tolerante a Errores

// ==========================================
// 1. UTILIDADES
// ==========================================
function formatearDinero(valor) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
}

function mostrarAlertaMensaje(mensaje, tipo) {
    const contenedorAlerta = document.getElementById("alerta-carrito");
    if (!contenedorAlerta) return;

    contenedorAlerta.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show fw-bold text-center shadow-sm" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 2. CONFIGURACIÓN INICIAL DE FILTROS
// ==========================================
function configurarFiltros(productos) {
    const filtroCategoria = document.getElementById("filtro-categoria");
    const filtroPrecio = document.getElementById("filtro-precio");
    const precioMaxTxt = document.getElementById("precio-max-txt");
    const rangoLimiteTxt = document.getElementById("rango-limite-txt");

    if (!filtroCategoria || !filtroPrecio) return;

    // Extraer categorías de forma segura
    const categoriasUnicas = [...new Set(productos.map(p => p.categoria || "Otros"))];

    let opcionesHTML = `<option value="TODAS">Todas las categorías</option>`;
    categoriasUnicas.forEach(cat => {
        opcionesHTML += `<option value="${cat}">${cat}</option>`;
    });
    filtroCategoria.innerHTML = opcionesHTML;

    // Calcular los precios con oferta para el rango máximo
    const productosConPrecioOferta = productos.map(p => {
        let copia = { ...p };
        if (copia.nombre && copia.nombre.toLowerCase().includes('teclado')) copia.precio = 34990;
        else if (copia.nombre && (copia.nombre.toLowerCase().includes('audífonos') || copia.nombre.toLowerCase().includes('audifonos'))) copia.precio = 59990;
        return copia;
    });

    const precioMasAlto = productosConPrecioOferta.reduce((max, p) => p.precio > max ? p.precio : max, 80000);

    filtroPrecio.max = precioMasAlto * 2; 
    filtroPrecio.value = precioMasAlto * 2;

    if (precioMaxTxt) precioMaxTxt.textContent = formatearDinero(precioMasAlto * 2);
    if (rangoLimiteTxt) rangoLimiteTxt.textContent = formatearDinero(precioMasAlto * 2);
}

function aplicarFiltrosCombinados() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const filtroCat = document.getElementById("filtro-categoria");
    const filtroPre = document.getElementById("filtro-precio");

    if (!filtroCat || !filtroPre) {
        renderizarProductos(productos);
        return;
    }

    const categoriaSeleccionada = filtroCat.value;
    const precioMaximoSeleccionado = Number(filtroPre.value);

    const productosFiltrados = productos.filter(producto => {
        let precioEvaluar = producto.precio || 0;
        if (producto.nombre && producto.nombre.toLowerCase().includes('teclado')) precioEvaluar = 34990;
        else if (producto.nombre && (producto.nombre.toLowerCase().includes('audífonos') || producto.nombre.toLowerCase().includes('audifonos'))) precioEvaluar = 59990;

        const catProducto = producto.categoria || "Otros";
        
        const cumpleCategoria = (categoriaSeleccionada === "TODAS" || catProducto === categoriaSeleccionada);
        const cumplePrecio = (precioEvaluar <= precioMaximoSeleccionado);
        
        return cumpleCategoria && cumplePrecio;
    });

    renderizarProductos(productosFiltrados);
}

// ==========================================
// 3. RENDERIZAR PRODUCTOS
// ==========================================
function renderizarProductos(productosAMostrar) {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return; 
    
    contenedor.innerHTML = ''; 

    if (!productosAMostrar || productosAMostrar.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted fs-5">No se encontraron productos en esta selección.</p>
            </div>
        `;
        return;
    }

    productosAMostrar.forEach(producto => {
        const agotado = producto.stock === 0;
        
        let precioHTML = `<strong>Precio:</strong> ${formatearDinero(producto.precio)}`;
        let etiquetaOferta = '';

        if (producto.nombre && producto.nombre.toLowerCase().includes('teclado')) {
            const precioOriginal = 49990;
            const precioOferta = 34990;
            etiquetaOferta = `<span class="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-pill small fw-bold" style="z-index: 10;">-30% Oferta</span>`;
            precioHTML = `<strong>Precio:</strong> <del class="text-muted small fw-normal">${formatearDinero(precioOriginal)}</del> <span class="text-danger fw-bold">${formatearDinero(precioOferta)}</span>`;
        } 
        else if (producto.nombre && (producto.nombre.toLowerCase().includes('audífonos') || producto.nombre.toLowerCase().includes('audifonos'))) {
            const precioOriginal = 79990;
            const precioOferta = 59990;
            etiquetaOferta = `<span class="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-pill small fw-bold" style="z-index: 10;">-25% Oferta</span>`;
            precioHTML = `<strong>Precio:</strong> <del class="text-muted small fw-normal">${formatearDinero(precioOriginal)}</del> <span class="text-danger fw-bold">${formatearDinero(precioOferta)}</span>`;
        }

        const img1 = producto.imagenes && producto.imagenes[0] ? producto.imagenes[0] : 'assets/placeholder.png';
        const img2 = producto.imagenes && producto.imagenes[1] ? producto.imagenes[1] : img1;

        const carruselHTML = `
            <div id="carrusel-${producto.id}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="${img1}" class="card-img-top p-3" alt="${producto.nombre} - 1" style="height: 180px; object-fit: contain;">
                    </div>
                    <div class="carousel-item">
                        <img src="${img2}" class="card-img-top p-3" alt="${producto.nombre} - 2" style="height: 180px; object-fit: contain;">
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carrusel-${producto.id}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true" style="background-color: rgba(0,0,0,0.4); border-radius: 50%;"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carrusel-${producto.id}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true" style="background-color: rgba(0,0,0,0.4); border-radius: 50%;"></span>
                </button>
            </div>
        `;

        const cardHTML = `
            <div class="col-md-6 mb-4 position-relative">
                <div class="card h-100 shadow-sm ${agotado ? 'border-danger' : ''}">
                    ${etiquetaOferta}
                    ${carruselHTML}
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-secondary mb-2 align-self-start">${producto.categoria || 'General'}</span>
                        <h5 class="card-title fw-bold text-dark">${producto.nombre}</h5>
                        <p class="card-text text-muted mb-1 small">${producto.descripcion}</p>
                        <p class="card-text mb-1 small">${precioHTML}</p>
                        <p class="card-text small text-${agotado ? 'danger fw-bold' : 'success'}">
                            ${agotado ? '¡Agotado!' : `Stock disponible: ${producto.stock}`}
                        </p>
                        <button 
                            class="btn ${agotado ? 'btn-secondary disabled' : 'btn-primary'} mt-auto fw-bold" 
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
// 4. RENDERIZAR CARRITO 
// ==========================================
function renderizarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const listaCarrito = document.getElementById('cuerpo-carrito'); 
    const totalCarrito = document.getElementById('total-carrito'); 

    if (!listaCarrito) return; 

    listaCarrito.innerHTML = '';
    let total = 0;

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

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        
        const itemHTML = `
            <tr>
                <td>
                    <span class="fw-bold d-block text-dark small">${producto.nombre}</span>
                    <small class="text-muted">${formatearDinero(producto.precio)} c/u</small>
                </td>
                
                <td>
                    <div class="d-flex align-items-center gap-1 mt-1">
                        <button class="btn btn-sm btn-outline-secondary py-0 px-1 fw-bold" style="font-size:0.75rem;" onclick="restarProducto(${producto.id})">-</button>
                        <span class="badge bg-primary">${producto.cantidad}</span>
                        <button class="btn btn-sm btn-danger py-0 px-1" style="font-size:0.75rem;" onclick="eliminarDelCarrito(${producto.id})" title="Eliminar">
                            🗑️
                        </button>
                    </div>
                </td>
                
                <td class="text-end align-middle fw-bold text-secondary small">
                    ${formatearDinero(subtotal)}
                </td>
            </tr>
        `;
        listaCarrito.innerHTML += itemHTML;
    });

    if (totalCarrito) {
        totalCarrito.innerText = formatearDinero(total);
    }
}

// ==========================================
// 5. LÓGICA DE STOCK Y CARRITO
// ==========================================
function agregarProducto(id) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let productoCatalogo = productos.find(p => p.id == id);
    
    if (!productoCatalogo || productoCatalogo.stock <= 0) return;

    if (productoCatalogo.nombre && productoCatalogo.nombre.toLowerCase().includes('teclado')) {
        productoCatalogo.precio = 34990; 
    } else if (productoCatalogo.nombre && (productoCatalogo.nombre.toLowerCase().includes('audífonos') || productoCatalogo.nombre.toLowerCase().includes('audifonos'))) {
        productoCatalogo.precio = 59990; 
    }

    let productoEnCarrito = carrito.find(p => p.id == id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
        productoEnCarrito.precio = productoCatalogo.precio; 
    } else {
        carrito.push({
            id: productoCatalogo.id,
            nombre: productoCatalogo.nombre,
            precio: productoCatalogo.precio,
            categoria: productoCatalogo.categoria || 'General',
            cantidad: 1
        });
    }

    productoCatalogo.stock--;

    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('carrito', JSON.stringify(carrito));

    aplicarFiltrosCombinados();
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
            aplicarFiltrosCombinados(); 
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
        aplicarFiltrosCombinados();
    }
}

// ==========================================
// 6. FUNCIONALIDADES ADICIONALES DEL CARRITO
// ==========================================

function vaciarCarritoCompleto() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) return;

    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    carrito.forEach(item => {
        const prodInv = productos.find(p => p.id === item.id);
        if (prodInv) {
            prodInv.stock += item.cantidad;
        }
    });

    localStorage.setItem('carrito', JSON.stringify([]));
    localStorage.setItem('productos', JSON.stringify(productos));

    // Vaciado silencioso (sin alertas en pantalla)
    aplicarFiltrosCombinados();
    renderizarCarrito();
}

function procesarCompraCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        mostrarAlertaMensaje("Tu carrito está vacío. Agrega productos antes de pagar.", "danger");
        return;
    }

    // Tu validación original estricta de usuario registrado
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
        mostrarAlertaMensaje("Debes iniciar sesión con tu cuenta para poder realizar una compra.", "danger");
        return;
    }

    const nombreCliente = usuarioActivo.nombre || "Usuario";

    // Compra exitosa: se limpia el carrito permanentemente
    localStorage.setItem('carrito', JSON.stringify([]));

    mostrarAlertaMensaje(`¡Compra exitosa! Muchas gracias por tu preferencia, ${nombreCliente}.`, "success");
    
    renderizarCarrito();
}

// ==========================================
// 7. INICIALIZACIÓN 
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    
    configurarFiltros(productos);
    aplicarFiltrosCombinados();
    renderizarCarrito();

    const btnVaciar = document.getElementById("btn-vaciar");
    const btnComprar = document.getElementById("btn-comprar");

    if (btnVaciar) btnVaciar.addEventListener("click", vaciarCarritoCompleto);
    if (btnComprar) btnComprar.addEventListener("click", procesarCompraCarrito);

    const filtroCategoria = document.getElementById("filtro-categoria");
    const filtroPrecio = document.getElementById("filtro-precio");
    const precioMaxTxt = document.getElementById("precio-max-txt");

    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", aplicarFiltrosCombinados);
    }
    
    if (filtroPrecio) {
        filtroPrecio.addEventListener("input", (e) => {
            if (precioMaxTxt) {
                precioMaxTxt.textContent = formatearDinero(Number(e.target.value));
            }
            aplicarFiltrosCombinados();
        });
    }
});