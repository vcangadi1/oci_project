"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { FaSun, FaMoon, FaAdjust } from "react-icons/fa";
import type { IconType } from "react-icons";

type Theme = "light" | "dark" | "high-contrast";

interface ThemeContextType {
  theme: Theme;
  changeTheme: (newTheme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  changeTheme: () => {},
});

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}

interface ThemeOption {
  key: Theme;
  label: string;
  icon: IconType;
}

const THEMES: ThemeOption[] = [
  { key: "light", label: "Light", icon: FaSun },
  { key: "dark", label: "Dark", icon: FaMoon },
  { key: "high-contrast", label: "High Contrast", icon: FaAdjust },
];

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("app-theme") as Theme) || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    setMounted(true);
  }, []);

  const changeTheme = (newTheme: Theme): void => {
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Prevent flash — apply theme attribute before first paint
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme, changeTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function ThemeSwitcher() {
  const { theme, changeTheme } = useTheme();

  return (
    <div className="theme-btn-group" role="group" aria-label="Theme selector">
      {THEMES.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.key}
            className={`theme-btn${theme === t.key ? " active" : ""}`}
            onClick={() => changeTheme(t.key)}
            title={t.label}
            aria-label={`Switch to ${t.label} theme`}
            type="button"
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
