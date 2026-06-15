import type { CourseDTO, CourseSummaryDTO } from '@skilldrop/shared';
import { api } from './api';

// Catálogo de cursos con el progreso del usuario en cada uno.
export function getCourses(): Promise<CourseSummaryDTO[]> {
  return api.get<CourseSummaryDTO[]>('/courses');
}

// Curso completo (fases + estado por usuario). Marca el curso como activo.
export function getCourse(idOrSlug: string): Promise<CourseDTO> {
  return api.get<CourseDTO>(`/courses/${idOrSlug}`);
}
