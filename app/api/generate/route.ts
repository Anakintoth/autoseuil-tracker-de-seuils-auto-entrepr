import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Tu es un conseiller expert en fiscalité pour auto-entrepreneurs français.
Tu aides les utilisateurs à comprendre leurs seuils de chiffre d'affaires, les conséquences d'un dépassement,
et les stratégies pour optimiser leur activité.
Tu parles uniquement en français. Tu es concis, précis et bienveillant.
Seuils 2026 à connaître :
- Prestations de services (BNC/BIC) : 77 700 €/an
- Ventes de marchandises / hébergement : 188 700 €/an
- Franchise TVA services : 36 800 € (seuil majoré 39 100 €)
- Franchise TVA ventes : 91 900 € (seuil majoré 101 000 €)`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userMessage = body.prompt || body.message || '';

  if (!userMessage.trim()) {
    return NextResponse.json({ result: '' }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not set');
    return NextResponse.json({ result: 'Service de conseil momentanément indisponible. Réessayez dans quelques instants.' }, { status: 503 });
  }

  let res: Response;
  try {
    res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });
  } catch (err) {
    console.error('Groq fetch error:', err);
    return NextResponse.json({ result: 'Service temporairement indisponible. Vérifiez votre connexion.' }, { status: 502 });
  }

  if (!res.ok) {
    const error = await res.text();
    console.error('Groq API error:', error);
    return NextResponse.json({ result: 'Service temporairement indisponible.' }, { status: 502 });
  }

  const data = await res.json();
  const result = data.choices?.[0]?.message?.content ?? '';
  return NextResponse.json({ result });
}
