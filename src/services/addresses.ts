import { api } from "./api";
import type { Address, AddressRequest } from "@/types";

// All endpoints are scoped to the authenticated user via the Bearer token —
// there is exactly one address per user, no {id} path segment.

export async function getAddress(): Promise<Address> {
  const { data } = await api.get<Address>("/addresses");
  return data;
}

export async function createAddress(payload: AddressRequest): Promise<Address> {
  const { data } = await api.post<Address>("/addresses", payload);
  return data;
}

export async function updateAddress(payload: AddressRequest): Promise<Address> {
  const { data } = await api.put<Address>("/addresses", payload);
  return data;
}

export async function deleteAddress(): Promise<void> {
  await api.delete("/addresses");
}
