"use client";
import { useMutation } from "@tanstack/react-query";
import javaService from "../services/javaService";
import { UserCreateParams } from "@/types/user";
import { ErrorMessageType } from "@/components/shared/errorMessages";

export interface SignupResponse {
  success?: boolean;
  message?: string;
  errors?: ErrorMessageType;
}

export const useSignupMutation = <TResponse = unknown>() => {
  return useMutation<TResponse, Error, UserCreateParams>({
    mutationKey: ["Signup"],
    mutationFn: async (data: UserCreateParams) =>
      javaService.register(data) as Promise<TResponse>,
  });
};
