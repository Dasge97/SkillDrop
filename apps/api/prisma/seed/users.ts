// Usuarios demo para probar el flujo (alumno + mentor).

export interface UserSeed {
  name: string;
  email: string;
  password: string; // en claro; el seed lo hashea
  role: 'STUDENT' | 'MENTOR' | 'ADMIN';
}

export const demoUsers: UserSeed[] = [
  {
    name: 'Alex Alumno',
    email: 'student@skilldrop.dev',
    password: 'skilldrop',
    role: 'STUDENT',
  },
  {
    name: 'Marta Mentora',
    email: 'mentor@skilldrop.dev',
    password: 'skilldrop',
    role: 'MENTOR',
  },
  {
    name: 'Ana Admin',
    email: 'admin@skilldrop.dev',
    password: 'skilldrop',
    role: 'ADMIN',
  },
];
