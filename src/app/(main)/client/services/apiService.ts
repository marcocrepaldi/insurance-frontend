// ✅ Define a URL base da API, utilizando variável de ambiente
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Lista todos os clientes da API
 */
export async function fetchClients() {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`, // ✅ Ative se usar autenticação
    },
    cache: "no-store", // 🔄 Evita cache e garante dados atualizados
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar clientes: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Cria um novo cliente
 * @param clientData Objeto com os dados do novo cliente
 */
export async function createClient(clientData: Record<string, any>) {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientData),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ao criar cliente: ${errorBody}`);
  }

  return response.json();
}

/**
 * Atualiza um cliente existente
 * @param id UUID do cliente
 * @param updatedData Dados parciais para atualizar
 */
export async function updateClient(id: string, updatedData: Record<string, any>) {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ao atualizar cliente: ${errorBody}`);
  }

  return response.json();
}

/**
 * Exclui um cliente pelo ID
 * @param id UUID do cliente
 */
export async function deleteClient(id: string) {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ao excluir cliente: ${errorBody}`);
  }

  return true;
}
