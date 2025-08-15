// components/shared/handleNetworkError.ts
export type NetworkErrorWithCode = Error & { code?: string };

export function handleNetworkError(error: unknown): never {
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    (error as NetworkErrorWithCode).code = "ERR_NETWORK";
  }
  throw error;
}
