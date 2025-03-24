// app/(dashboard)/users/actions.ts
"use server";

export async function deleteUsers(userIds: string[]) {
  const deleteRequests = userIds.map((id) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: "DELETE",
    })
  );

  await Promise.all(deleteRequests);
}
