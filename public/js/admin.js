import { auth } from '../js/auth.js';
import { requests } from '../js/request.js';

// Verificar autenticación y permisos
if (!auth.isAuthenticated() || !auth.isAdmin()) {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', async function() {
    // Cargar solicitudes pendientes
    await loadPendingRequests();
    
    // Configurar botones
    document.getElementById('logoutBtn').addEventListener('click', function() {
        auth.logout();
    });
    
    document.getElementById('historyBtn').addEventListener('click', function() {
        window.location.href = 'history.html';
    });
});

// Carga las solicitudes pendientes y las muestra en pantalla.
// Si no hay, muestra un mensaje. Si hay, genera el HTML con los datos
// y botones para aprobar o rechazar. Maneja errores en consola.

async function loadPendingRequests() {
    try {
        const pendingRequests = await requests.getPendingRequests();
        const container = document.getElementById('pendingRequests');
        
        if (pendingRequests.length === 0) {
            container.innerHTML = '<p>No hay solicitudes pendientes</p>';
            return;
        }
        
        container.innerHTML = pendingRequests.map(request => `
    <div class="request-item">
        <div class="request-info">
            <h3>${request.userName}</h3>
            <p><strong>Sede:</strong> ${request.sede}</p>
            <p><strong>Computadora:</strong> ${request.codigoComputadora}</p>
            <p><strong>Salida:</strong> ${request.fechaSalida}</p>
            <p><strong>Regreso:</strong> ${request.fechaRegreso}</p>
        </div>
        <div class="request-actions">
            <button class="btn btn-success" onclick="approveRequest('${request.id}')">Aprobar</button>
            <button class="btn btn-danger" onclick="rejectRequest('${request.id}')">Rechazar</button>
        </div>
    </div>
`).join('');

        
    } catch (error) {
        console.error('Error cargando solicitudes:', error);
    }
}

// Funciones globales para los botones
// Estas funciones permiten aprobar o rechazar solicitudes y mostrar mensajes de éxito o error al usuario.
window.approveRequest = async function(id) {
    try {
        await requests.approveRequest(id);
        showMessage('Solicitud aprobada correctamente', 'success');
        await loadPendingRequests();
    } catch (error) {
        showMessage('Error al aprobar solicitud: ' + error.message, 'error');
    }
};

window.rejectRequest = async function(id) {
    try {
        await requests.rejectRequest(id);
        showMessage('Solicitud rechazada correctamente', 'success');
        await loadPendingRequests();
    } catch (error) {
        showMessage('Error al rechazar solicitud: ' + error.message, 'error');
    }
};

function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = type === 'success' ? 'success-message' : 'error-message';
    message.style.display = 'block';
    
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}
