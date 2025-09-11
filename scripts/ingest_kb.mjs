import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function chunkText(text, maxChars=3000, overlap=300) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + maxChars, text.length);
    chunks.push(text.slice(i, end));
    i = end - overlap;
    if (i < 0) i = 0;
    if (i >= text.length) break;
  }
  return chunks;
}

async function embed(text) {
  const r = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ model: "text-embedding-3-small", input: text })
  });
  const j = await r.json();
  if (!j?.data?.[0]?.embedding) throw new Error("No embedding");
  return j.data[0].embedding;
}

async function main(pdfRelativePath, title, licenseNote="", sourceUrl=null) {
  const absPath = path.resolve(process.cwd(), pdfRelativePath);
  if (!fs.existsSync(absPath)) throw new Error("PDF no encontrado: " + absPath);

  const data = await pdf(fs.readFileSync(absPath));
  const raw = (data.text || "").replace(/\r/g, "").trim();
  if (!raw) throw new Error("No se pudo extraer texto del PDF");

  const { data: src, error: e1 } = await supabase
    .from("cluequest_kb_sources")
    .insert({ title, source_url: sourceUrl, license_note: licenseNote })
    .select()
    .single();
  if (e1) throw e1;

  const chunks = chunkText(raw, 3000, 300);
  console.log(`Trozos: ${chunks.length}`);

  for (let idx = 0; idx < chunks.length; idx++) {
    const c = chunks[idx];
    const emb = await embed(c);
    const { error: e2 } = await supabase
      .from("cluequest_kb_chunks")
      .insert({ source_id: src.id, chunk_index: idx, content: c, embedding: emb });
    if (e2) throw e2;
    console.log(`✅ Chunk ${idx+1}/${chunks.length}`);
  }
  console.log("🎉 Ingesta completa.");
}

const [,, p, t, lic, url] = process.argv;
if (!p || !t) {
  console.log('Uso: node scripts/ingest_kb.mjs ./docs/archivo.pdf "Titulo" "Licencia" "URL"');
  process.exit(1);
}
main(p, t, lic || "", url || null).catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
