import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { message } = body

  try {
    const res = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer local",
      },
      body: JSON.stringify({
        model: "mistral-7b-instruct-v0.3",
        messages: [
          {
            role: "user",
            content: `[INST] ${message} [/INST]`,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      }),
    })

    const data = await res.json()
    const response = data.choices?.[0]?.message?.content || "Resposta não recebida."

    return NextResponse.json({ response })
  } catch (err) {
    console.error("Erro ao se conectar à IA local:", err)
    return NextResponse.json(
      { response: "Erro ao se conectar à IA local." },
      { status: 500 }
    )
  }
}
