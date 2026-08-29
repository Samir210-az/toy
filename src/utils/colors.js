export const ZAL_RENGLERI = [
  { hex: '#6366f1', dot: 'bg-indigo-500', text: 'text-indigo-300', ring: 'ring-indigo-400', border: 'border-indigo-400/50', soft: 'bg-indigo-500/20', strong: 'bg-indigo-500/60', gradient: 'from-indigo-500/35' },
  { hex: '#f43f5e', dot: 'bg-rose-500', text: 'text-rose-300', ring: 'ring-rose-400', border: 'border-rose-400/50', soft: 'bg-rose-500/20', strong: 'bg-rose-500/60', gradient: 'from-rose-500/35' },
  { hex: '#f59e0b', dot: 'bg-amber-500', text: 'text-amber-300', ring: 'ring-amber-400', border: 'border-amber-400/50', soft: 'bg-amber-500/20', strong: 'bg-amber-500/60', gradient: 'from-amber-500/35' },
  { hex: '#10b981', dot: 'bg-emerald-500', text: 'text-emerald-300', ring: 'ring-emerald-400', border: 'border-emerald-400/50', soft: 'bg-emerald-500/20', strong: 'bg-emerald-500/60', gradient: 'from-emerald-500/35' },
  { hex: '#0ea5e9', dot: 'bg-sky-500', text: 'text-sky-300', ring: 'ring-sky-400', border: 'border-sky-400/50', soft: 'bg-sky-500/20', strong: 'bg-sky-500/60', gradient: 'from-sky-500/35' },
  { hex: '#d946ef', dot: 'bg-fuchsia-500', text: 'text-fuchsia-300', ring: 'ring-fuchsia-400', border: 'border-fuchsia-400/50', soft: 'bg-fuchsia-500/20', strong: 'bg-fuchsia-500/60', gradient: 'from-fuchsia-500/35' },
  { hex: '#f97316', dot: 'bg-orange-500', text: 'text-orange-300', ring: 'ring-orange-400', border: 'border-orange-400/50', soft: 'bg-orange-500/20', strong: 'bg-orange-500/60', gradient: 'from-orange-500/35' },
  { hex: '#14b8a6', dot: 'bg-teal-500', text: 'text-teal-300', ring: 'ring-teal-400', border: 'border-teal-400/50', soft: 'bg-teal-500/20', strong: 'bg-teal-500/60', gradient: 'from-teal-500/35' },
];

export function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getZalColor(zalId, zallar) {
  const index = zallar.findIndex((z) => z.id === zalId);
  return ZAL_RENGLERI[(index >= 0 ? index : 0) % ZAL_RENGLERI.length];
}
