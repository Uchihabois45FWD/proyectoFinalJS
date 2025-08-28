import { auth } from './auth.js';

// Configuración inicial
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está autenticado
    if (auth.isAuthenticated()) {
        auth.redirectByRole();
        return;
    }

    // Configurar formulario de login
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                await auth.login(username, password);
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