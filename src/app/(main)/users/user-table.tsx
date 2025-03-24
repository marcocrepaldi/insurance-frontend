'use client'

import { useState } from 'react'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { User } from '@/schemas/user'
import { deleteUsers } from './actions'
import { DataTableUser } from '../../../components/tables/data-table-user'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

type Props = {
  data: User[]
}

export function UserTable({ data }: Props) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [openDialog, setOpenDialog] = useState(false)

  const handleDelete = async () => {
    const ids = selectedUsers.map((user) => user.id)
    await deleteUsers(ids)
    window.location.reload()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="default">+ Novo Usuário</Button>

        {selectedUsers.length > 0 && (
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Excluir Selecionados ({selectedUsers.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Os usuários selecionados serão removidos
                  permanentemente do sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <DataTableUser
        data={data}
        onSelectedRowsChange={(rows) => setSelectedUsers(rows)}
      />
    </div>
  )
}
