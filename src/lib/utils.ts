import { ApiErrorBackend } from "@/types"
import axios from "axios"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodIssue } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatErrorsToResponse = (errors: ZodIssue[]) => {
  return errors.map((issue) => ({
    path: issue.path[0],
    message: issue.message,
  }))
}

export const getErrorMessage = (error: unknown): string => {
  let message: string

  if (error instanceof Error) {
    console.log(error.message)
    message = error.message
  } else if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    message = error.message
  } else if (typeof error === "string") {
    message = error
  } else {
    message = "Something went wrong."
  }

  return message
}

export const handleGeneralErrors = (err: unknown) => {
  if (axios.isAxiosError<ApiErrorBackend>(err)) {
    if (Array.isArray(err.response?.data.errors)) {
      return err.response.data.errors
    } else if (err.response?.data.message) {
      return err.response.data.message
    } else {
      return "Server Error"
    }
  } else {
    return getErrorMessage(err)
  }
}
