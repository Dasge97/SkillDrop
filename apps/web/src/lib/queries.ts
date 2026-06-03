import type { CourseDTO } from '@skilldrop/shared';
import { api } from './api';

// Obtiene el curso principal (el primero del catálogo) con el estado por usuario.
export async function getMainCourse(): Promise<CourseDTO> {
  const list = await api.get<Array<{ id: string; slug: string }>>('/courses');
  if (!list.length) throw new Error('No hay cursos disponibles');
  return api.get<CourseDTO>(`/courses/${list[0].id}`);
}
