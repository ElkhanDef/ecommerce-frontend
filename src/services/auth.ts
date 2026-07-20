import { api } from "./api";
import { clearTokens, setTokens } from "./token-storage";
import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResetTokenVerifyResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  UserResponse,
} from "@/types";

/** Signs in and persists the returned token pair. */
export async function signIn(payload: SignInRequest): Promise<SignInResponse> {
  const { data } = await api.post<SignInResponse>("/auth/sign-in", payload);
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

/**
 * Registers a new account. The backend sends a verification e-mail;
 * the user cannot sign in until the address is verified.
 */
export async function signUp(payload: SignUpRequest): Promise<UserResponse> {
  const body: SignUpRequest = { ...payload };
  if (!body.phoneNumber) {
    delete body.phoneNumber;
  }
  const { data } = await api.post<UserResponse>("/auth/sign-up", body);
  return data;
}

/** Verifies a freshly registered account via the token from the e-mail link. */
export async function verifyAccount(token: string): Promise<void> {
  await api.post("/auth/sign-up/verify", null, { params: { token } });
}

/**
 * Requests a password-reset e-mail. The backend responds 200 even for
 * unknown addresses (no account enumeration), so success only means
 * "if the account exists, a mail was sent".
 */
export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<void> {
  await api.post("/auth/forgot-password", payload);
}

/** Checks whether a reset token from the e-mail link is (still) valid. */
export async function verifyResetToken(token: string): Promise<boolean> {
  const { data } = await api.get<ResetTokenVerifyResponse>(
    "/auth/reset-password/verify",
    { params: { token } },
  );
  return data.valid;
}

/** Sets a new password using the reset token from the e-mail link. */
export async function resetPassword(
  payload: ResetPasswordRequest,
): Promise<void> {
  await api.post("/auth/reset-password", payload);
}

export function signOut(): void {
  clearTokens();
}
