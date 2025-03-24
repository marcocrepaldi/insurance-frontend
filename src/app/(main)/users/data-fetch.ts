// app/(dashboard)/users/data-fetch.ts
export async function getAllUsers() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      cache: "no-store",
    });
  
    if (!res.ok) throw new Error("Erro ao buscar usuários");
  
    return res.json();
  }
  