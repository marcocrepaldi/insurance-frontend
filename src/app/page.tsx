'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Chatbot Watson Assistant
declare global {
  interface Window {
    watsonAssistantChatOptions: any
  }
}

export default function HomePage() {
  useEffect(() => {
    window.watsonAssistantChatOptions = {
      integrationID: 'a0346238-e28e-44ee-a827-29b527691003',
      region: 'aws-us-east-1',
      serviceInstanceID: '20250410-1255-4344-209b-05295b3890e4',
      onLoad: async (instance: any) => {
        await instance.render()
      },
    }

    setTimeout(() => {
      const script = document.createElement('script')
      script.src =
        'https://web-chat.global.assistant.watson.appdomain.cloud/versions/' +
        (window.watsonAssistantChatOptions.clientVersion || 'latest') +
        '/WatsonAssistantChatEntry.js'
      document.head.appendChild(script)
    }, 0)
  }, [])

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] items-center justify-items-center p-8 sm:p-20 gap-10 font-[family-name:var(--font-geist-sans)]">
      {/* Header com logo */}
      <header className="flex items-center justify-center">
        <Image
          src="/harper.png"
          alt="Logo do Sistema para Corretores"
          width={180}
          height={38}
          priority
          className="dark:invert"
        />
      </header>

      {/* Conteúdo principal */}
      <main className="flex flex-col items-center text-center sm:text-left sm:items-start gap-8 max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-semibold leading-snug tracking-tight">
          Tudo que o corretor precisa, em um só lugar
        </h1>
        <ul className="list-decimal list-inside text-muted-foreground text-sm sm:text-base font-[family-name:var(--font-geist-mono)] space-y-2">
          <li>Gerencie clientes, apólices e comissões de forma integrada.</li>
          <li>Plataforma ágil, segura e intuitiva para corretores modernos.</li>
        </ul>

        {/* Ações principais */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="rounded-full bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors font-medium h-11 px-6 text-sm sm:text-base flex items-center justify-center"
          >
            Entrar
          </Link>
          <Link
            href="/sobre"
            className="rounded-full border border-muted hover:bg-muted/30 transition-colors font-medium h-11 px-6 text-sm sm:text-base flex items-center justify-center"
          >
            Saiba mais
          </Link>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
        <Link href="/funcionalidades" className="flex items-center gap-2 hover:underline">
          <Image src="/file.svg" alt="" width={16} height={16} aria-hidden />
          Funcionalidades
        </Link>
        <Link href="/precos" className="flex items-center gap-2 hover:underline">
          <Image src="/window.svg" alt="" width={16} height={16} aria-hidden />
          Preços
        </Link>
        <Link href="/contato" className="flex items-center gap-2 hover:underline">
          <Image src="/globe.svg" alt="" width={16} height={16} aria-hidden />
          Contato
        </Link>
      </footer>
    </div>
  )
}
