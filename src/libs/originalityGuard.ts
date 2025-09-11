// Simple tokenizer without external dependencies
function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0);
}

export function jaccard5gram(a: string, b: string) {
  const ng = (t: string) => {
    const w = tokenize(t);
    const grams = new Set<string>();
    for (let i=0; i<w.length-4; i++) grams.add(w.slice(i,i+5).join(" "));
    return grams;
  };
  const A = ng(a), B = ng(b);
  const inter = new Set([...A].filter(x => B.has(x)));
  const union = new Set([...A, ...B]);
  return inter.size / Math.max(1, union.size);
}

export function leaksSource(t: string) {
  return /(scribd|cap[ií]tulo|p[áa]gina \d+|https?:\/\/|seg[uú]n|fuente:)/i.test(t);
}
