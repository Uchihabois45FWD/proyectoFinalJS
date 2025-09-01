// Controla el login: autenticación, redirección y mensajes de error.
import { auth } from '../js/auth.js';
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
            // Deshabilitar botón durante la petición
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Verificando...';
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
            } finally {
                // Rehabilitar botón
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});