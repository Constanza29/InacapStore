// js/contacto.js

// Función obligatoria 5: Validar Formulario Contacto
function validarFormularioContacto(evento) {
    evento.preventDefault(); // Evitar recarga de página

    // Capturar valores
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const contenedorAlerta = document.getElementById('alerta-contacto');

    // Limpiar alertas previas (Manipulación segura del DOM)
    contenedorAlerta.textContent = ''; 

    // Expresión regular básica para validar correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validaciones
    if (nombre === '' || correo === '' || mensaje === '') {
        mostrarAlerta(contenedorAlerta, 'Todos los campos son obligatorios.', 'danger');
        return;
    }

    if (!regexCorreo.test(correo)) {
        mostrarAlerta(contenedorAlerta, 'Por favor, ingresa un correo electrónico válido.', 'danger');
        return;
    }

    if (mensaje.length < 10) {
        mostrarAlerta(contenedorAlerta, 'El mensaje debe contener al menos 10 caracteres.', 'danger');
        return;
    }

    // Si pasa todas las validaciones
    mostrarAlerta(contenedorAlerta, '¡Mensaje enviado con éxito! Nos contactaremos a la brevedad.', 'success');
    
    // Limpiar el formulario
    document.getElementById('form-contacto').reset();
}

// Función auxiliar para crear la alerta de forma segura en el DOM
function mostrarAlerta(contenedor, texto, tipo) {
    const divAlerta = document.createElement('div');
    // Asignación de clases Bootstrap
    divAlerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    divAlerta.setAttribute('role', 'alert');
    
    // Creación segura de texto (evita inyección HTML)
    const textoNodo = document.createTextNode(texto);
    divAlerta.appendChild(textoNodo);

    contenedor.appendChild(divAlerta);
}

// Asignar el evento al formulario
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-contacto');
    if (formulario) {
        formulario.addEventListener('submit', validarFormularioContacto);
    }
});