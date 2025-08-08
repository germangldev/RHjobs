import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Globe } from "lucide-react";
import logo from "/logo.svg";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { language, toggleLanguage } = useThemeLanguage();
  const location = useLocation();
  const isBlog = location.pathname.startsWith("/blog");

  useEffect(() => {
    if (!isBlog) {
      const handleScroll = () => setIsScrolled(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(false);
    }
  }, [isBlog]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <nav
      className={`z-50 flex items-center justify-between transition-all duration-0
        ${isBlog
          ? "fixed top-0 left-0 w-full bg-light dark:bg-navbar shadow-md px-6 py-4"
          : `fixed top-4 left-1/2 transform -translate-x-1/2
            ${isScrolled
              ? "bg-light dark:bg-navbar shadow-md py-2 px-4 rounded-3xl w-[90%]"
              : "bg-light dark:bg-navbar py-3 px-8 w-[95%] md:w-[90%]"}`
        }
        ${className}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="logo" className="h-6 md:h-8" />
      </Link>

      {/* Menu */}
      <div className="hidden md:flex space-x-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm text-dark dark:text-light transition-themes">
        {isScrolled || isBlog ? (
          <>
            <Link to="/docs" className="space-x-8 px-4 py-2 hover:text-primary">📄</Link>
            <Link to="/company" className="space-x-8 px-4 py-2  hover:text-primary">🏢</Link>
            <Link to="/blog" className="space-x-8 px-4 py-2  hover:text-primary">📰</Link>
          </>
        ) : (
          <>
            <Link to="/docs" className="space-x-4 px-4 py-2 font-small rounded-full text-sm text-dark dark:text-light border-2 border-transparent hover:border-primary hover:bg-primary hover:text-light dark:hover:border-secondary dark:hover:bg-secondary transition">
              {language === "ES" ? "DOCUMENTOS" : "DOCS"}
            </Link>
            <Link to="/company" className="space-x-4 px-4 py-2 font-small rounded-full text-sm text-dark dark:text-light border-2 border-transparent hover:border-primary hover:bg-primary hover:text-light dark:hover:border-secondary dark:hover:bg-secondary transition">
              {language === "ES" ? "EMPRESA" : "COMPANY"}
            </Link>
            <Link to="/blog" className="space-x-4 px-4 py-2 font-small rounded-full text-sm text-dark dark:text-light border-2 border-transparent hover:border-primary hover:bg-primary hover:text-light dark:hover:border-secondary dark:hover:bg-secondary transition">
              {language === "ES" ? "BLOG" : "BLOG"}
            </Link>
          </>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-3">
        <Link
          to="/login"
          className="px-4 py-2 font-medium rounded-full border border-gray-300 dark:border-gray-600 text-sm text-dark dark:text-light
          hover:border-primary hover:bg-primary hover:text-light 
          dark:hover:border-secondary dark:hover:bg-secondary transition"
        >
          {language === "ES" ? "Iniciar sesión" : "Log In"}
        </Link>
        <button
          onClick={toggleLanguage}
          className="px-3 py-2 rounded-full border border-gray-300 text-sm text-dark dark:text-light 
          hover:border-primary hover:bg-primary hover:text-light 
          dark:hover:border-secondary dark:hover:bg-secondary transition"
        >
          {isScrolled || isBlog ? <Globe className="w-4 h-4" /> : language}
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full border border-gray-300 text-dark dark:text-light
          hover:border-primary hover:bg-primary hover:text-light 
          dark:hover:border-secondary dark:hover:bg-secondary transition"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </nav>
  );
};
