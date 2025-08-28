const API_BASE = 'http://localhost:3001';

// Función genérica para hacer peticiones HTTP
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Verificar si hay contenido para parsear
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error en la petición API:', error);
        throw error;
    }
}

// CRUD para usuarios
export const usersAPI = {
    getAll: () => fetchAPI('/users'),
    getById: (id) => fetchAPI(`/users/${id}`),
    getByUsername: async (username) => {
        const users = await fetchAPI('/users');
        return users.find(user => user.username === username);
    }
};

// CRUD para solicitudes
export const requestsAPI = {
    getAll: () => fetchAPI('/requests'),
    getById: (id) => fetchAPI(`/requests/${id}`),
    getPending: async () => {
        const requests = await fetchAPI('/requests');
        return requests.filter(request => request.estado === 'pendiente');
    },
    getByUserId: async (userId) => {
        const requests = await fetchAPI('/requests');
        return requests.filter(request => request.userId === userId);
    },
    create: (request) => fetchAPI('/requests', {
        method: 'POST',
        body: JSON.stringify(request)
    }),
    update: (id, updates) => fetchAPI(`/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    }),
    delete: (id) => fetchAPI(`/requests/${id}`, {
        method: 'DELETE'
    })
};

// CRUD para sedes
export const sedesAPI = {
    getAll: async () => {
        const sedes = await fetchAPI('/sedes');
        return sedes.map(sede => sede.nombre); // Retornar solo los nombres
    }
};

// Estadísticas con reduce
export const getStats = async () => {
    const requests = await requestsAPI.getAll();
    
    return requests.reduce((stats, request) => {
        // Total por estado
        stats[request.estado] = (stats[request.estado] || 0) + 1;
        
        // Total por usuario
        stats.usuarios[request.userId] = (stats.usuarios[request.userId] || 0) + 1;
        
        // Total general
        stats.total++;
        
        return stats;
    }, { total: 0, usuarios: {} });
};