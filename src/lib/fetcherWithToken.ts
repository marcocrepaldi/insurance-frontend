export const fetcherWithToken = async (url: string) => {
  if (typeof window === "undefined") {
    throw new Error("fetcherWithToken só pode ser usado no cliente");
  }

  const token = localStorage.getItem("jwt_token");

  if (!token) {
    throw new Error("Token de autenticação não encontrado");
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL não configurada");
  }

  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

  const res = await fetch(fullUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar dados autenticados: ${res.statusText}`);
  }

  return res.json();
};
