import { auth } from '../js/auth.js';
import { requests } from '../js/request.js';
import { usersAPI } from '../services/servicesUsers.js';

// Verificar autenticación
if (!auth.isAuthenticated() || auth.isAdmin()) {
    window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', async function() {
    const user = auth.getCurrentUser();
    
    // Configurar información del usuario
    document.getElementById('userName').value = user.name;
    document.getElementById('userWelcome').textContent += user.name;
    
    // Cargar sedes
    await loadSedes();
    
    // Configurar fechas mínimas
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaSalida').min = today;
    document.getElementById('fechaRegreso').min = today;
    
    // Configurar formularios
    document.getElementById('requestForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await submitRequest();
    });
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        auth.logout();
    });
    
    // Configurar edición de nombre
    document.getElementById('editNameBtn').addEventListener('click', function() {
    });
    
    // Configurar modal de edición de nombre
    setupEditNameModal();
    
    // Cargar solicitudes del usuario
    await loadUserRequests();
});

async function loadSedes() {
    try {
        const sedes = await requests.getSedes();
        const sedeSelect = document.getElementById('sede');
        
        // Limpiar select primero
        sedeSelect.innerHTML = '<option value="">Seleccionar sede</option>';
        
        // Agregar solo las dos sedes
        sedes.forEach(sede => {
            const option = document.createElement('option');
            option.value = sede;
            option.textContent = sede;
            sedeSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error cargando sedes:', error);
        // Cargar sedes por defecto si hay error
        const sedeSelect = document.getElementById('sede');
        sedeSelect.innerHTML = `
            <option value="">Seleccionar sede</option>
            <option value="Sede La Capri">Sede La Capri</option>
            <option value="Sede Puntarenas">Sede Puntarenas</option>
        `;
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
        showMessage('Solicitud enviada correctamente', 'success');
        
        // Limpiar formulario
        document.getElementById('requestForm').reset();
        
        // Recargar solicitudes del usuario
        await loadUserRequests();
        
    } catch (error) {
        showMessage('Error al enviar la solicitud: ' + error.message, 'error');
    }
}

function setupEditNameModal() {
    const modal = document.getElementById('editNameModal');
    const closeBtn = document.querySelector('.close');
    const editForm = document.getElementById('editNameForm');
    
    document.getElementById('editNameBtn').addEventListener('click', function() {
        modal.style.display = 'block';
        document.getElementById('newName').value = auth.getCurrentUser().name;
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    editForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await updateUserName();
    });
}

async function updateUserName() {
    try {
        const newName = document.getElementById('newName').value;
        const user = auth.getCurrentUser();
        
        // Actualizar en la API (PUT)
        const updatedUser = await usersAPI.update(user.id, { 
            ...user, 
            name: newName 
        });
        
        // Actualizar en sessionStorage
        const updatedUserWithoutPassword = { ...updatedUser };
        delete updatedUserWithoutPassword.password;
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUserWithoutPassword));
        
        // Actualizar en la UI
        document.getElementById('userName').value = newName;
        document.getElementById('userWelcome').textContent = 'Bienvenido, ' + newName;
        
        // Cerrar modal
        document.getElementById('editNameModal').style.display = 'none';
        
        showMessage('Nombre actualizado correctamente', 'success');
        
    } catch (error) {
        showMessage('Error al actualizar el nombre: ' + error.message, 'error');
    }
}

async function loadUserRequests() {
    try {
        const userRequests = await requests.getUserRequests();
        const container = document.getElementById('userRequestsList');
        
        if (userRequests.length === 0) {
            container.innerHTML = '<p>No tienes solicitudes enviadas</p>';
            return;
        }
        
        container.innerHTML = userRequests.map(request => `
            <div class="request-item">
                <div class="request-info">
                    <h3>Solicitud #${request.id}</h3>
                    <p><strong>Sede:</strong> ${request.sede}</p>
                    <p><strong>Computadora:</strong> ${request.codigoComputadora}</p>
                    <p><strong>Salida:</strong> ${request.fechaSalida}</p>
                    <p><strong>Regreso:</strong> ${request.fechaRegreso}</p>
                    <p><strong>Estado:</strong> <span class="estado-${request.estado}">${request.estado}</span></p>
                    <p><strong>Fecha solicitud:</strong> ${new Date(request.fechaSolicitud).toLocaleDateString()}</p>
                </div>
                <div class="request-actions">
                    ${request.estado === 'pendiente' ? `
                        <button class="btn btn-warning" onclick="cancelRequest(${request.id})">Cancelar</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error cargando solicitudes:', error);
    }
}

// Función para cancelar solicitud (DELETE)
window.cancelRequest = async function(id) {
    if (confirm('¿Estás seguro de que quieres cancelar esta solicitud?')) {
        try {
            await requests.deleteRequest(id);
            showMessage('Solicitud cancelada correctamente', 'success');
            await loadUserRequests();
        } catch (error) {
            showMessage('Error al cancelar la solicitud: ' + error.message, 'error');
        }
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