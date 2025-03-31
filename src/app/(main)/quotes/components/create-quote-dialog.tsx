'use client'

import { useEffect, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuotes } from '../use-quotes'
import { useClients } from '../hooks/use-clients'
import { useProducers } from '../hooks/use-producers'
import { useAuth } from '../hooks/use-auth'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function CreateQuoteDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState('')
  const [producerId, setProducerId] = useState('')
  const [expectedPremium, setExpectedPremium] = useState('')
  const [loading, setLoading] = useState(false)

  const { user, token } = useAuth()
  const { mutate } = useQuotes()
  const { clients, loading: loadingClients } = useClients()
  const { producers } = useProducers()

  const isAdmin = user?.role?.name === 'ADMIN'

  useEffect(() => {
    if (!isAdmin && user?.id) {
      setProducerId(user.id)
    }
  }, [user, isAdmin])

  const handleSubmit = async () => {
    if (!title || !clientId || (!producerId && isAdmin)) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const payload = {
      title,
      clientId,
      producerId: isAdmin ? producerId : user?.id,
      expectedPremium: parseFloat(expectedPremium) || 0,
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/insurance-quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()

      toast.success('Cotação criada com sucesso!')
      setOpen(false)
      mutate()
    } catch {
      toast.error('Erro ao criar a cotação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 right-4">Nova Cotação</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Oportunidade</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Input
            placeholder="Título da Cotação"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingClients ? 'Carregando clientes...' : 'Selecione o cliente'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isAdmin && (
            <Select value={producerId} onValueChange={setProducerId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o produtor" />
              </SelectTrigger>
              <SelectContent>
                {producers.map((producer) => (
                  <SelectItem key={producer.id} value={producer.id}>
                    {producer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Input
            placeholder="Prêmio Estimado (R$)"
            value={expectedPremium}
            type="number"
            onChange={(e) => setExpectedPremium(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? 'Salvando...' : 'Salvar Cotação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
