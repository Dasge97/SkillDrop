// Une clases condicionales (mini-clsx sin dependencias).
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function scoreColor(score: number | null): string {
  if (score == null) return 'text-muted-foreground';
  if (score >= 8) return 'text-success';
  if (score >= 7) return 'text-primary';
  if (score >= 5) return 'text-warning';
  return 'text-danger';
}
