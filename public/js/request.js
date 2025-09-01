import { requestsAPI, sedesAPI } from '../services/servicesUsers.js';
import { auth } from '../js/auth.js';

export const requests = {
    // Crear nueva solicitud - CORREGIDO
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

    // Cancelar solicitud
    deleteRequest: async (id) => {
        return await requestsAPI.delete(id);
    },
    
    // Obtener sedes disponibles - SOLO 2 SEDES
    getSedes: async () => {
        try {
            return await sedesAPI.getAll();
        } catch (error) {
            console.error('Error cargando sedes:', error);
            // Devuelve solo las dos sedes requeridas
            return ["Sede La Capri", "Sede Puntarenas"];
        }
    }
};

export const searchRequests = async (searchTerm) => {
    try {
        const requests = await requestsAPI.getAll();
        return requests.filter(request => 
            request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.codigoComputadora.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.fechaSalida.includes(searchTerm) ||
            request.fechaRegreso.includes(searchTerm)
        );
    } catch (error) {
        console.error('Error buscando solicitudes:', error);
        return [];
    }
};