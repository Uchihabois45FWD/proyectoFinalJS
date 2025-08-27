// Datos de usuarios predefinidos
const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        name: 'Administrador Principal',
        email: 'admin@escuela.com',
        role: 'admin'
    },
    {
        id: 2,
        username: 'estudiante1',
        password: 'estudiante123',
        name: 'Juan Pérez',
        email: 'juan@escuela.com',
        role: 'student'
    },
    {
        id: 3,
        username: 'estudiante2',
        password: 'estudiante123',
        name: 'María García',
        email: 'maria@escuela.com',
        role: 'student'
    }
];

// Función para validar credenciales
function validateCredentials(username, password) {
    return users.find(user => user.username === username && user.password === password);
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

// Exportar funciones
export const auth = {
    login: (username, password) => {
        const user = validateCredentials(username, password);
        
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