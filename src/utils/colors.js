export const ZAL_RENGLERI = [
  { dot: 'bg-indigo-500', text: 'text-indigo-400', ring: 'ring-indigo-400', border: 'border-indigo-400/40', soft: 'bg-indigo-500/10', gradient: 'from-indigo-500/20' },
  { dot: 'bg-rose-500', text: 'text-rose-400', ring: 'ring-rose-400', border: 'border-rose-400/40', soft: 'bg-rose-500/10', gradient: 'from-rose-500/20' },
  { dot: 'bg-amber-500', text: 'text-amber-400', ring: 'ring-amber-400', border: 'border-amber-400/40', soft: 'bg-amber-500/10', gradient: 'from-amber-500/20' },
  { dot: 'bg-emerald-500', text: 'text-emerald-400', ring: 'ring-emerald-400', border: 'border-emerald-400/40', soft: 'bg-emerald-500/10', gradient: 'from-emerald-500/20' },
  { dot: 'bg-sky-500', text: 'text-sky-400', ring: 'ring-sky-400', border: 'border-sky-400/40', soft: 'bg-sky-500/10', gradient: 'from-sky-500/20' },
  { dot: 'bg-fuchsia-500', text: 'text-fuchsia-400', ring: 'ring-fuchsia-400', border: 'border-fuchsia-400/40', soft: 'bg-fuchsia-500/10', gradient: 'from-fuchsia-500/20' },
  { dot: 'bg-orange-500', text: 'text-orange-400', ring: 'ring-orange-400', border: 'border-orange-400/40', soft: 'bg-orange-500/10', gradient: 'from-orange-500/20' },
  { dot: 'bg-teal-500', text: 'text-teal-400', ring: 'ring-teal-400', border: 'border-teal-400/40', soft: 'bg-teal-500/10', gradient: 'from-teal-500/20' },
];

export function getZalColor(zalId, zallar) {
  const index = zallar.findIndex((z) => z.id === zalId);
  return ZAL_RENGLERI[(index >= 0 ? index : 0) % ZAL_RENGLERI.length];
}
