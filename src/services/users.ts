import { api } from "./api";
import type { CurrentUser } from "@/types";

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await api.get<CurrentUser>("/users/me");
  return data;
}

/** Admin-only. There is no list-all-users endpoint yet — lookup is by id only. */
export async function getUserForManagement(id: number): Promise<CurrentUser> {
  const { data } = await api.get<CurrentUser>(`/users/management/${id}`);
  return data;
}
