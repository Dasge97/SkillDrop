import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AdminUserDTO, Role } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Badge, Card, CardContent, Spinner } from '@/components/ui';

const ROLES: Role[] = ['STUDENT', 'MENTOR', 'ADMIN'];
const ROLE_TONE: Record<Role, 'muted' | 'primary' | 'danger'> = {
  STUDENT: 'muted',
  MENTOR: 'primary',
  ADMIN: 'danger',
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

  if (isLoading || !users) {
    return <div className="flex h-48 items-center justify-center"><Spinner className="h-7 w-7 text-primary" /></div>;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">XP</th>
                <th className="px-4 py-3 font-medium">Entregas</th>
                <th className="px-4 py-3 font-medium">Cambiar rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={ROLE_TONE[u.role]}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3">{u.totalXp}</td>
                  <td className="px-4 py-3">{u.submissionCount}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      disabled={u.id === me?.id || mutation.isPending}
                      onChange={(e) => mutation.mutate({ id: u.id, role: e.target.value as Role })}
                      className="h-9 rounded-lg border border-input bg-background px-2 text-sm disabled:opacity-50"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
