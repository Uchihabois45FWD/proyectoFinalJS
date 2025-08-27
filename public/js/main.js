import { auth } from './auth.js';

// Configuración inicial
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está autenticado
    if (auth.isAuthenticated()) {
        auth.redirectByRole();
        return;
    }

    // Configurar modal
    setupModal();

    // Configurar formulario de login
    const loginForm = document.querySelector('.login-form');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.display = 'none';
    
    // Insertar mensaje de error después del formulario
    if (loginForm) {
        loginForm.appendChild(errorMessage);
        
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                await auth.login(username, password);
                // Cerrar modal después de login exitoso
                closeModal();
                auth.redirectByRole();
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
                
                // Ocultar mensaje después de 3 segundos
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 3000);
            }
        });
    }
});

// Configuración del modal
function setupModal() {
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('loginModal');

    // Abrir modal
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    // Cerrar modal con botón (X)
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeModal();
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Limpiar formulario al cerrar
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.reset();
        }
        
        // Ocultar mensajes de error
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
}