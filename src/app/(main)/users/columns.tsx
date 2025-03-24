// app/(dashboard)/users/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "../../../schemas/user";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role.name",
    header: "Perfil",
    cell: ({ row }) => row.original.role?.name || "-",
  },
];
