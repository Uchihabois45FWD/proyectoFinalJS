<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('loginModal');

  // Abrir modal
  openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  // Cerrar modal con botón (X)
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Cerrar modal con tecla Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
  });
});
=======
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
>>>>>>> ddab91b492d222b0801374f82c296e023242c07f
