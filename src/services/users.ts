import { api } from "./api";
import type { CurrentUser } from "@/types";

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await api.get<CurrentUser>("/users/me");
  return data;
}
