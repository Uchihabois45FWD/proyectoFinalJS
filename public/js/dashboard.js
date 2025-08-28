import { auth } from '../js/auth.js';
import { requests } from '../js/request.js';

// Verificar autenticación
if (!auth.isAuthenticated() || auth.isAdmin()) {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', async function() {
    const user = auth.getCurrentUser();
    
    // Configurar información del usuario
    document.getElementById('userName').value = user.name;
    
    // Cargar sedes
    await loadSedes();
    
    // Configurar fechas mínimas
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaSalida').min = today;
    document.getElementById('fechaRegreso').min = today;
    
    // Configurar formulario
    document.getElementById('requestForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await submitRequest();
    });
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        auth.logout();
    });
});

async function loadSedes() {
    try {
        const sedes = await requests.getSedes();
        console.log(sedes);
        const sedeSelect = document.getElementById('sede');
        
        sedes.forEach(sede => {
            const option = document.createElement('option');
            option.value = sede;
            option.textContent = sede;
            sedeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando sedes:', error);
    }
}

async function submitRequest() {
    try {
        const requestData = {
            sede: document.getElementById('sede').value,
            fechaSalida: document.getElementById('fechaSalida').value,
            fechaRegreso: document.getElementById('fechaRegreso').value,
            codigoComputadora: document.getElementById('codigoComputadora').value,
            aceptoCondiciones: document.getElementById('aceptoCondiciones').checked,
            firma: document.getElementById('firma').value || ''
        };
        
        await requests.createRequest(requestData);
        
        // Mostrar mensaje de éxito
        const message = document.getElementById('message');
        message.textContent = 'Solicitud enviada correctamente';
        message.className = 'success-message';
        message.style.display = 'block';
        
        // Limpiar formulario
        document.getElementById('requestForm').reset();
        document.getElementById('userName').value = auth.getCurrentUser().name;
        
    } catch (error) {
        const message = document.getElementById('message');
        message.textContent = 'Error al enviar la solicitud: ' + error.message;
        message.className = 'error-message';
        message.style.display = 'block';
    }
}