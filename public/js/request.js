import { requestsAPI, sedesAPI } from '../services/servicesUsers.js';
import { auth } from '../js/auth.js';

export const requests = {
    // Crear nueva solicitud
    createRequest: async (requestData) => {
        const user = auth.getCurrentUser();
        
        const newRequest = {
            ...requestData,
            userId: user.id,
            userName: user.name,
            estado: 'pendiente',
            fechaSolicitud: new Date().toISOString()
        };
        
        return await requestsAPI.create(newRequest);
    },

    // Obtener solicitudes del usuario actual
    getUserRequests: async () => {
        const user = auth.getCurrentUser();
        return await requestsAPI.getByUserId(user.id);
    },

    // Obtener todas las solicitudes (admin)
    getAllRequests: async () => {
        return await requestsAPI.getAll();
    },

    // Obtener solicitudes pendientes (admin)
    getPendingRequests: async () => {
        return await requestsAPI.getPending();
    },

    // Aprobar solicitud
    approveRequest: async (id) => {
        return await requestsAPI.update(id, { estado: 'aprobado' });
    },

    // Rechazar solicitud
    rejectRequest: async (id) => {
        return await requestsAPI.update(id, { estado: 'rechazado' });
    },

    // Obtener sedes disponibles
    getSedes: async () => {
        return await sedesAPI.getAll();
    }
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
