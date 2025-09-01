import { usersAPI } from '../services/servicesUsers.js';
// Función para validar credenciales usando la API
async function validateCredentials(username, password) {
    try {
        const users = await usersAPI.getAll();
        return users.find(user => user.username === username && user.password === password);
    } catch (error) {
        console.error('Error validating credentials:', error);
        return null;
    }
}

// Función para guardar sesión de usuario
function saveUserSession(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

// Función para obtener usuario actual
function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
}

// Función para cerrar sesión
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

export const auth = {
    login: async (username, password) => { // <-- Añadir async aquí
        const user = await validateCredentials(username, password); // <-- Añadir await aquí
        
        if (!user) {
            throw new Error('Credenciales incorrectas');
        }

        // Guardar sesión (sin password por seguridad)
        const { password: _, ...userWithoutPassword } = user;
        saveUserSession(userWithoutPassword);
        
        return userWithoutPassword;
    },

    
    logout,
    
    getCurrentUser,
    
    isAuthenticated: () => {
        return getCurrentUser() !== null;
    },
    
    isAdmin: () => {
        const user = getCurrentUser();
        return user && user.role === 'admin';
    },
    
    redirectByRole: () => {
        const user = getCurrentUser();
        
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        switch (user.role) {
            case 'admin':
                window.location.href = 'admin.html';
                break;
            case 'student':
                window.location.href = 'dashboard.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }
};