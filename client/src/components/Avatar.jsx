const tones = [
  'bg-ink text-parchment',
  'bg-crimson/10 text-crimson',
  'bg-gold/20 text-[#7a5813]',
  'bg-emerald-100 text-emerald-800',
  'bg-indigo-100 text-indigo-800',
  'bg-rose-100 text-rose-800',
  'bg-cyan-100 text-cyan-800',
];

const sizes = {
  sm: 'h-9 w-9 text-[0.65rem]',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
};

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function hash(value) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) % 997;
  }
  return result;
}

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const tone = tones[hash(name) % tones.length];

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide ring-1 ring-inset ring-ink/10 ${sizes[size]} ${tone} ${className}`}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
