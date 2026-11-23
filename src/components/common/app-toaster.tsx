"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

/** One Sonner toaster for the whole site, following the site theme. */
export function AppToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: "!rounded-2xl !border-line !bg-surface-solid !text-foreground !font-sans",
          description: "!text-muted-foreground",
        },
      }}
    />
  );
}
