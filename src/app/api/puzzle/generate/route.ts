import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { embed, cosine } from "@/libs/emb";
import { jaccard5gram, leaksSource } from "@/libs/originalityGuard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function retrieve(qEmb: number[], k=8, thr=0.55) {
  const { data, error } = await supabase.rpc("match_kb_chunks", {
    query_embedding: qEmb, match_count: k, similarity_threshold: thr
  });
  if (error) throw new Error(error.message);
  return data || [];
}

async function llmGeneratePrompt(payload: any) {
  const sys = `Eres diseñador de juegos. Prohibido copiar texto literal. Prohibido citar o insinuar fuentes. Reescribe desde cero. Adapta al tema: ${payload.tema}. No uses frases del material de referencia. Devuelve JSON: title,story,setup,steps[],solution,hints[],props[],safety`;
  const user = `Diseña un puzzle original basado en la mecánica ${payload.mecanica} para escena ${payload.escena}.
Requisitos:
- Tono: ${payload.tono}
- Dificultad: ${payload.nivel}
- Materiales: ${(payload.materiales||[]).join(", ")}
- Duración: ${payload.minutos} min`;
  const r = await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{ "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"gpt-4o-mini",
      messages:[{role:"system",content:sys},{role:"user",content:user}],
      response_format:{type:"json_object"}
    })
  });
  const j = await r.json();
  return j.choices[0].message.content; // JSON string
}

async function originalityPass(text: string, refs: any[], maxCos=0.82, maxJac=0.18) {
  const outEmb = await embed(text);
  for (const r of refs) {
    // r.content está accesible pero NO se muestra al usuario
    const refEmb = r.embedding || await embed(r.content);
    const cos = cosine(outEmb, refEmb);
    const jac = jaccard5gram(text, r.content);
    if (cos > maxCos || jac > maxJac || leaksSource(text)) return false;
  }
  return true;
}

export async function POST(req: Request) {
  const payload = await req.json();
  const { data: pol } = await supabase.from("cluequest_policy").select("*").single();
  const maxSim = pol?.max_similarity ?? 0.82;

  const q = `${payload.mecanica} ${payload.tema} escena ${payload.escena}`;
  const qEmb = await embed(q);
  const refs = await retrieve(qEmb, 8, 0.55);

  // intento con reintentos controlados
  for (let i=0; i<4; i++) {
    const raw = await llmGeneratePrompt(payload);
    let obj = JSON.parse(raw);
    const finalText = [obj.title,obj.story,obj.setup,(obj.steps||[]).join("\n"),obj.solution,(obj.hints||[]).join("\n")]
      .filter(Boolean).join("\n");

    const ok = await originalityPass(finalText, refs, maxSim, 0.18);
    if (ok) {
      // Sanitiza leaks
      const clean = (t?:string)=> t?.replace(/https?:\/\/\S+|Scribd|cap[ií]tulo|fuente:.*/gi,"");
      obj.story = clean(obj.story);
      obj.setup = clean(obj.setup);
      return NextResponse.json(obj);
    }
    // Ajusta tono para alejar más
    payload.tono = "más metafórico, diferentes nombres y estructura";
  }

  return NextResponse.json({ error: "No se logró una salida suficientemente original. Intenta con otro prompt." }, { status: 409 });
}
