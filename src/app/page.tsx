'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Declaração global para evitar erro de tipo
declare global {
  interface Window {
    watsonAssistantChatOptions: any
  }
}

export default function Home() {
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Conteúdo principal da página */}
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/harper.png"
          alt="Logo do Sistema para Corretores"
          width={180}
          height={38}
          priority
        />
        {/* Texto introdutório */}
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Gerencie clientes, apólices e comissões em um único lugar.
          </li>
          <li className="tracking-[-.01em]">
            Plataforma intuitiva, ágil e segura para corretores.
          </li>
        </ol>

        {/* Botões de ação */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/login"
          >
            Entrar
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/sobre"
          >
            Saiba Mais
          </Link>
        </div>
      </main>

      {/* Rodapé específico desta página */}
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/funcionalidades"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="Icone funcionalidades"
            width={16}
            height={16}
          />
          Funcionalidades
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/precos"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Icone preços"
            width={16}
            height={16}
          />
          Preços
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/contato"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Icone contato"
            width={16}
            height={16}
          />
          Contato
        </Link>
      </footer>
    </div>
  )
}
