import {create} from 'zustand'

export const useThemeStore = create((set)=>({
    theme: typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark",
    setTheme: (theme) =>{
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", theme);
            document.documentElement.setAttribute("data-theme", theme);
        }
        set({theme});
    },
}))

