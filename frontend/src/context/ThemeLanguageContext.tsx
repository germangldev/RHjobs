import { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type Language = "ES" | "EN";

interface ThemeLanguageContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("ES");

  // Cargar tema desde localStorage

    useEffect(() => {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
    }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const toggleLanguage = () => {
    const newLang = language === "ES" ? "EN" : "ES";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <ThemeLanguageContext.Provider value={{ theme, toggleTheme, language, toggleLanguage }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) throw new Error("useThemeLanguage debe usarse dentro de ThemeLanguageProvider");
  return context;
};
