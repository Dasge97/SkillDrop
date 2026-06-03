import { cn } from '@/lib/utils';

// Variantes de la mascota (máquina expendedora) según la situación.
export type MascotVariant =
  | 'hero'
  | 'login'
  | 'success'
  | 'working'
  | 'submit'
  | 'idea'
  | 'guide'
  | 'medal';

const LABEL: Record<MascotVariant, string> = {
  hero: 'Mascota de SkillDrop dando la bienvenida',
  login: 'Mascota de SkillDrop guiñando un ojo',
  success: 'Mascota de SkillDrop celebrando',
  working: 'Mascota de SkillDrop con lápiz y bocetos',
  submit: 'Mascota de SkillDrop con portátil',
  idea: 'Mascota de SkillDrop con una idea',
  guide: 'Mascota de SkillDrop señalando un diagrama',
  medal: 'Mascota de SkillDrop con una medalla',
};

export function Mascot({
  variant,
  className,
  alt,
}: {
  variant: MascotVariant;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={`/mascot/${variant}.png`}
      alt={alt ?? LABEL[variant]}
      className={cn('select-none object-contain drop-shadow-sm', className)}
      draggable={false}
    />
  );
}
