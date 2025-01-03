import { create, StoreApi, UseBoundStore } from "zustand";
import { ThemeStore } from "../types";

export const useThemeStore: UseBoundStore<StoreApi<ThemeStore>> = create(
    (set, get) => ({
        theme: localStorage.getItem("chat-theme") || "dark",
        setTheme: (theme) => {
            if (theme !== undefined) {
                localStorage.setItem("chat-theme", theme);
                set({ theme: theme });
            };
            
            document.querySelector("html")?.setAttribute("data-theme", get().theme)
        },
    })
);
