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
        
        return await response.json();
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
    },
    create: (userData) => fetchAPI('/users', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    update: (id, userData) => fetchAPI(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData)
    }),
    delete: (id) => fetchAPI(`/users/${id}`, {
        method: 'DELETE'
    })
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
        method: 'PATCH',
        body: JSON.stringify(updates)
    }),
    delete: (id) => fetchAPI(`/requests/${id}`, {
        method: 'DELETE'
    })
};

// CRUD para sedes - ESPECIALMENTE MODIFICADO PARA 2 SEDES
export const sedesAPI = {
    getAll: async () => {
        try {
            const sedes = await fetchAPI('/sedes');
            // Extraer solo los nombres de las sedes
            return sedes.map(sede => sede.nombre);
        } catch (error) {
            console.error('Error cargando sedes:', error);
            // Fallback con solo las dos sedes requeridas
            return ["Sede La Capri", "Sede Puntarenas"];
        }
    },
    getById: (id) => fetchAPI(`/sedes/${id}`),
    create: (sede) => fetchAPI('/sedes', {
        method: 'POST',
        body: JSON.stringify(sede)
    }),
    update: (id, sede) => fetchAPI(`/sedes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(sede)
    }),
    delete: (id) => fetchAPI(`/sedes/${id}`, {
        method: 'DELETE'
    })
};

// Función para buscar solicitudes
export const searchRequests = async (searchTerm) => {
    const requests = await requestsAPI.getAll();
    return requests.filter(request => 
        request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.codigoComputadora.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.fechaSalida.includes(searchTerm) ||
        request.fechaRegreso.includes(searchTerm)
    );
};