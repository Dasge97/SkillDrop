import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AdminUserDTO, Role } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Avatar, Badge, PageLoader, Select, Table } from '@/components/ui';

const ROLES: Role[] = ['STUDENT', 'MENTOR', 'ADMIN'];

type BadgeTone = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
const ROLE_TONE: Record<Role, BadgeTone> = {
  STUDENT: 'primary',
  MENTOR:  'success',
  ADMIN:   'warning',
};

export function AdminUsers() {
  const { user: me } = useAuth();
  const qc = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<AdminUserDTO[]>('/admin/users'),
  });

  const mutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      api.patch(`/admin/users/${id}/role`, { role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      qc.invalidateQueries({ queryKey: ['admin-overview'] });
    },
  });

  if (isLoading || !users) return <PageLoader />;

  return (
    <Table head={['Usuario', 'Rol', 'XP', 'Entregas', 'Cambiar rol']}>
      {users.map((u) => (
        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
          {/* Usuario */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar name={u.name} size="sm" />
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">{u.name}</p>
                <p className="text-xs text-slate-400">{u.email}</p>
              </div>
            </div>
          </td>

          {/* Rol */}
          <td className="px-4 py-3">
            <Badge tone={ROLE_TONE[u.role]}>{u.role}</Badge>
          </td>

          {/* XP */}
          <td className="px-4 py-3 tabular-nums text-slate-600 dark:text-slate-300">
            {u.totalXp.toLocaleString('es')}
          </td>

          {/* Entregas */}
          <td className="px-4 py-3 tabular-nums text-slate-600 dark:text-slate-300">
            {u.submissionCount}
          </td>

          {/* Cambiar rol */}
          <td className="px-4 py-3">
            <Select
              value={u.role}
              disabled={u.id === me?.id || mutation.isPending}
              onChange={(e) => mutation.mutate({ id: u.id, role: e.target.value as Role })}
              className="!py-1.5 !text-xs w-36"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </Select>
          </td>
        </tr>
      ))}
    </Table>
  );
}
