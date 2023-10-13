import React, { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const toastRef = useRef(null);

  const showToast = (severity, summary, detail) => {
    if (toastRef.current) {
      toastRef.current.show({ severity, summary, detail });
    }
  };

  const toastFunctions = {
    success: (summary, detail) => showToast("success", summary, detail),
    error: (summary, detail) => showToast("error", summary, detail),
    info: (summary, detail) => showToast("info", summary, detail),
    warn: (summary, detail) => showToast("warn", summary, detail),
  };

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <ToastContext.Provider value={toastFunctions}>
        {children}
      </ToastContext.Provider>
    </>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;
