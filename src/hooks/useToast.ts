import { toast as sonnerToast } from "sonner"
import { toast as toastifyToast } from "react-toastify"
import { TOAST_LIBRARY } from "../toast.config"

type ToastOptions = Record<string, unknown>

type ToastAPI = {
  success: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
  warning: (message: string, options?: ToastOptions) => void
  info: (message: string, options?: ToastOptions) => void
}

const getToastLib = () =>
  TOAST_LIBRARY === "sonner" ? sonnerToast : toastifyToast

const buildOptions = (variant: string, options?: ToastOptions) => {
  if (TOAST_LIBRARY === "sonner") {
    return {
      classNames: {
        toast: `toast-root ${variant}`,
      },
      ...(options || {}),
    }
  }

  return {
    className: `toast-root ${variant}`,
    ...(options || {}),
  }
}

export const useToast = (): ToastAPI => {
  const toast = getToastLib()

  return {
    success: (msg, options) =>
      toast.success(msg, buildOptions("toast-success", options)),

    error: (msg, options) =>
      toast.error(msg, buildOptions("toast-error", options)),

    warning: (msg, options) =>
      toast.warning(msg, buildOptions("toast-warning", options)),

    info: (msg, options) =>
      toast.info(msg, buildOptions("toast-info", options)),
  }
}