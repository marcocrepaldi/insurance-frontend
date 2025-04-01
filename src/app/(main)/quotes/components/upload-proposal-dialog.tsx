'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useAuth } from '../hooks/use-auth'

interface UploadProposalProps {
  quoteId: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function UploadProposalDialog({ quoteId }: UploadProposalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [totalPremium, setTotalPremium] = useState('')
  const [insuredAmount, setInsuredAmount] = useState('')
  const [insurerName, setInsurerName] = useState('Seguradora Exemplo')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { token } = useAuth()

  const handleUpload = async () => {
    if (!file) return toast.error('Selecione um arquivo PDF.')
    if (file.type !== 'application/pdf') {
      return toast.error('O arquivo precisa ser um PDF válido.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('quoteId', quoteId)
    formData.append('insurerName', insurerName)
    formData.append('totalPremium', totalPremium)
    formData.append('insuredAmount', insuredAmount)

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/insurance-quotes/proposals/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error()
      toast.success('Proposta enviada com sucesso!')
      setFile(null)
      setOpen(false)
    } catch {
      toast.error('Falha no envio do PDF.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Enviar Proposta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Proposta (PDF)</DialogTitle>
        </DialogHeader>

        <Input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Input
          type="text"
          placeholder="Nome da Seguradora"
          className="mt-2"
          value={insurerName}
          onChange={(e) => setInsurerName(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Prêmio Total"
          className="mt-2"
          value={totalPremium}
          onChange={(e) => setTotalPremium(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Valor Segurado"
          className="mt-2"
          value={insuredAmount}
          onChange={(e) => setInsuredAmount(e.target.value)}
        />

        <DialogFooter>
          <Button disabled={loading || !file} onClick={handleUpload}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
