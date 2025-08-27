import { getUsers, createUser, findUserByCredentials, getAdmins, getStudents } from './serviceUsers.js';

export async function initializeUsers() {
    try {
        const [existingStudents, existingAdmins] = await Promise.all([
            getStudents(),
            getAdmins()
        ]);
        
        if (existingStudents.length === 0 && existingAdmins.length === 0) {
            const initialAdmins = [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    email: 'admin@escuela.com',
                    role: 'admin',
                    name: 'Administrador Principal'
                }
            ];

            const initialStudents = [
                {
                    id: 2,
                    username: 'estudiante1',
                    password: 'estudiante123',
                    email: 'estudiante1@escuela.com',
                    role: 'student',
                    name: 'Juan Pérez'
                },
                {
                    id: 3,
                    username: 'profesor1',
                    password: 'profesor123',
                    email: 'profesor1@escuela.com',
                    role: 'teacher',
                    name: 'María García'
                }
            ];

            for (const admin of initialAdmins) {
                await createUser(admin);
            }

            for (const student of initialStudents) {
                await createUser(student);
            }
        }
    } catch (error) {
        console.error('Error inicializando usuarios:', error);
    }
}

export async function userExists(username) {
    const users = await getUsers();
    return users.some(user => user.username === username);
}

export async function registerUser(userData) {
    if (await userExists(userData.username)) {
        throw new Error('El usuario ya existe');
    }

    const newUser = {
        ...userData,
        id: Date.now(), 
        role: 'student' 
    };

    return await createUser(newUser);
}