import axios from 'axios'

export async function fetchUsers() {
  const token = localStorage.getItem('accessToken') // Corrigido aqui!

  if (!token) {
    throw new Error('Token não encontrado. Usuário não autenticado.')
  }

  const response = await axios.get(
    'https://insurance-api-production-55fa.up.railway.app/api/users',
    {
      headers: {
        Authorization: `Bearer ${token}`, // Cabeçalho correto
      },
    }
  )
  return response.data
}
