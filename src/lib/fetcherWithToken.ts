export const fetcherWithToken = async (url: string) => {
  if (typeof window === "undefined") {
    throw new Error("fetcherWithToken só pode ser usado no cliente");
  }

  const token = localStorage.getItem("jwt_token"); // ✅ corrigido aqui

  if (!token) {
    throw new Error("Token de autenticação não encontrado");
  }

  const fullUrl = url.startsWith("http")
    ? url
    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}${url}`;

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
