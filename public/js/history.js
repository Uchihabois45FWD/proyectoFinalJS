import { auth } from '../js/auth.js';
import { requests } from '../js/request.js';
import { searchRequests } from '../js/request.js';

// Verificar autenticación
if (!auth.isAuthenticated()) {
    window.location.href = '/';
}

// Variable para almacenar todas las solicitudes
let allRequests = [];

document.addEventListener('DOMContentLoaded', async function() {
    // Cargar todas las solicitudes
    await loadAllRequests();
    
    // Configurar búsqueda
    document.getElementById('searchInput').addEventListener('input', async function(e) {
        await handleSearch(e.target.value);
    });
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        auth.logout();
    });
    
    // Mostrar botón de admin solo para administradores
    const adminBtn = document.getElementById('adminBtn');
    if (auth.isAdmin()) {
        adminBtn.style.display = 'block';
        adminBtn.addEventListener('click', function() {
            window.location.href = '/admin.html';
        });
    } else {
        adminBtn.style.display = 'none';
    }
    
    // Botón para recargar solicitudes
    document.getElementById('reloadBtn').addEventListener('click', async function() {
        await loadAllRequests();
    });
});

async function loadAllRequests(searchTerm = '') {
    try {
        if (auth.isAdmin()) {
            allRequests = await requests.getAllRequests();
        } else {
            allRequests = await requests.getUserRequests();
        }
        
        await handleSearch(searchTerm);
    } catch (error) {
        console.error('Error cargando solicitudes:', error);
        displayErrorMessage('Error al cargar las solicitudes');
    }
}

async function handleSearch(searchTerm) {
    let filteredRequests = allRequests;
    
    if (searchTerm) {
        filteredRequests = await searchRequests(searchTerm);
    }
    
    displayRequests(filteredRequests);
}

function displayRequests(requestsList) {
    const container = document.getElementById('requestsList');
    
    if (!requestsList || requestsList.length === 0) {
        container.innerHTML = '<p>No se encontraron solicitudes</p>';
        return;
    }
    
    // Ordenar solicitudes por fecha más reciente primero
    const sortedRequests = requestsList.sort((a, b) => 
        new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud)
    );
    
    container.innerHTML = sortedRequests.map(request => `
        <div class="request-item">
            <div class="request-info">
                <h3>${request.userName || 'Usuario no disponible'}</h3>
                <p><strong>Estado:</strong> <span class="estado-${request.estado || 'pendiente'}">${request.estado || 'Pendiente'}</span></p>
                <p><strong>Sede:</strong> ${request.sede || 'No especificada'}</p>
                <p><strong>Computadora:</strong> ${request.codigoComputadora || 'No especificada'}</p>
                <p><strong>Salida:</strong> ${request.fechaSalida || 'No especificada'}</p>
                <p><strong>Regreso:</strong> ${request.fechaRegreso || 'No especificada'}</p>
                <p><strong>Solicitado:</strong> ${request.fechaSolicitud ? new Date(request.fechaSolicitud).toLocaleDateString() : 'Fecha no disponible'}</p>
            </div>
        </div>
    `).join('');
}

function displayErrorMessage(message) {
    const container = document.getElementById('requestsList');
    container.innerHTML = `<p class="error-message">${message}</p>`;
}

// Función para ser llamada desde otros archivos cuando se crea una nueva solicitud
window.refreshHistory = async function() {
    await loadAllRequests();
};