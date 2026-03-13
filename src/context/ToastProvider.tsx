import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TOAST_LIBRARY } from "../toast.config";



type Props = {
  children: ReactNode
}

export default function ToastProvider({ children }: Props) {
    return (
        <>
            {children}

            {TOAST_LIBRARY === "sonner" && (
                <Toaster position="top-right" richColors={false} />
            )}

            {TOAST_LIBRARY === "toastify" && (
                <ToastContainer position="top-right" />
            )}
        </>
    );
}