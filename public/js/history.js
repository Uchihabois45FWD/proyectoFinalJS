import { auth } from '../js/auth.js';
import { requests, searchRequests } from '../js/request.js';

// Verificar autenticación
if (!auth.isAuthenticated()) {
    window.location.href = 'index.html';
}

let allRequests = []; // Variable para almacenar todas las solicitudes

document.addEventListener('DOMContentLoaded', async function() {
    // Cargar todas las solicitudes
    await loadAllRequests();
    
    // Configurar búsqueda
    document.getElementById('searchInput').addEventListener('input', function(e) {
        filterRequests(e.target.value);
    });
    
    // Configurar botones
    document.getElementById('logoutBtn').addEventListener('click', function() {
        auth.logout();
    });
    
    // Mostrar botón de admin solo para administradores
    const adminBtn = document.getElementById('adminBtn');
    if (auth.isAdmin()) {
        adminBtn.style.display = 'block';
        adminBtn.addEventListener('click', function() {
            window.location.href = 'admin.html';
        });
    } else {
        adminBtn.style.display = 'none';
    }
});

async function loadAllRequests() {
    try {
        if (auth.isAdmin()) {
            allRequests = await requests.getAllRequests();
        } else {
            allRequests = await requests.getUserRequests();
        }
        
        displayRequests(allRequests);
    } catch (error) {
        console.error('Error cargando solicitudes:', error);
        document.getElementById('requestsList').innerHTML = '<p>Error cargando las solicitudes</p>';
    }
}

function filterRequests(searchTerm) {
    if (!searchTerm.trim()) {
        displayRequests(allRequests);
        return;
    }
    
    const filtered = allRequests.filter(request => 
        request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.codigoComputadora.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.sede.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.fechaSalida.includes(searchTerm) ||
        request.fechaRegreso.includes(searchTerm)
    );
    
    displayRequests(filtered);
}

function displayRequests(requestsList) {
    const container = document.getElementById('requestsList');
    
    if (requestsList.length === 0) {
        container.innerHTML = '<p>No se encontraron solicitudes</p>';
        return;
    }
    
    // Usar map para generar el HTML de cada solicitud
    container.innerHTML = requestsList.map(request => `
        <div class="request-item">
            <div class="request-info">
                <h3>${request.userName}</h3>
                <p><strong>Estado:</strong> <span class="estado-${request.estado}">${request.estado}</span></p>
                <p><strong>Sede:</strong> ${request.sede}</p>
                <p><strong>Computadora:</strong> ${request.codigoComputadora}</p>
                <p><strong>Salida:</strong> ${request.fechaSalida}</p>
                <p><strong>Regreso:</strong> ${request.fechaRegreso}</p>
                <p><strong>Solicitado:</strong> ${new Date(request.fechaSolicitud).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
    
    // Añadir estilos para los estados si no existen
    if (!document.getElementById('estado-styles')) {
        const style = document.createElement('style');
        style.id = 'estado-styles';
        style.textContent = `
            .estado-aprobado { color: #27ae60; font-weight: bold; }
            .estado-rechazado { color: #e74c3c; font-weight: bold; }
            .estado-pendiente { color: #f39c12; font-weight: bold; }
        `;
        document.head.appendChild(style);
    }
}