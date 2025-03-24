// src/lib/api/users.ts

import axios from 'axios'

export async function fetchUsers() {
  const token = localStorage.getItem('jwt_token') // Obter o token armazenado

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.')
  }

  const response = await axios.get(
    'https://insurance-api-production-55fa.up.railway.app/api/users',
    {
      headers: {
        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
      },
    }
  )
  return response.data
}
