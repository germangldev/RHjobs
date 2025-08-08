import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

export function LandingPage() {
  const { language } = useThemeLanguage();

  return (
    <div className="w-full min-h-screen bg-light dark:bg-dark transition-colors">
      <Navbar />

      {/* HERO */}
      <section
        id="inicio"
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 md:pt-40 bg-light dark:bg-dark transition-colors"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-secondary dark:text-light mb-6">
          {language === "ES"
            ? "Trabaja donde siempre habías soñado"
            : "Work where you've always dreamed"}
        </h1>
        <p className="text-lg text-dark dark:text-light mb-8 max-w-2xl">
          {language === "ES"
            ? "La forma más sencilla de gestionar tus candidaturas, con herramientas diseñadas para ti."
            : "The easiest way to manage your applications, with tools designed just for you."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/login"
            className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-full text-lg font-semibold transition transform hover:scale-105"
          >
            {language === "ES" ? "Iniciar sesión" : "Login"}
          </Link>
          <Link
            to="/register"
            className="bg-secondary hover:bg-primary text-white px-6 py-3 rounded-full text-lg font-semibold transition transform hover:scale-105"
          >
            {language === "ES" ? "Comienza ahora" : "Get Started"}
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="why-us"
        className="w-full py-24 px-6 text-center bg-white dark:bg-dark transition-colors"
      >
        <h2 className="text-3xl font-bold text-secondary dark:text-light mb-12">
          {language === "ES" ? "¿Por qué elegirnos?" : "Why choose us?"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 bg-light dark:bg-secondary rounded-3xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-secondary dark:text-light">
              {language === "ES" ? "Gestión sencilla" : "Simple management"}
            </h3>
            <p className="text-dark dark:text-light">
              {language === "ES"
                ? "Organiza tu día a día con nuestra plataforma intuitiva."
                : "Organize your day-to-day with our intuitive platform."}
            </p>
          </div>
          <div className="p-8 bg-light dark:bg-secondary rounded-3xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-secondary dark:text-light">
              {language === "ES" ? "Seguridad garantizada" : "Guaranteed security"}
            </h3>
            <p className="text-dark dark:text-light">
              {language === "ES"
                ? "Tus datos están protegidos con los estándares más altos."
                : "Your data is protected with the highest standards."}
            </p>
          </div>
          <div className="p-8 bg-light dark:bg-secondary rounded-3xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-secondary dark:text-light">
              {language === "ES" ? "Soporte 24/7" : "24/7 Support"}
            </h3>
            <p className="text-dark dark:text-light">
              {language === "ES"
                ? "Estamos disponibles siempre que lo necesites."
                : "We are available whenever you need us."}
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="w-full py-24 px-6 text-center bg-gradient-to-b from-light to-white dark:from-dark dark:to-secondary transition-colors"
      >
        <h2 className="text-3xl font-bold text-secondary dark:text-light mb-12">
          {language === "ES"
            ? "Sobre nuestra plataforma"
            : "About our platform"}
        </h2>
        <p className="text-lg text-dark dark:text-light max-w-4xl mx-auto leading-relaxed">
          {language === "ES"
            ? "Nuestra misión es ayudarte a alcanzar tus objetivos con herramientas modernas y seguras. Únete a cientos de usuarios que ya confían en nosotros y transforma la forma en que gestionas tu trabajo."
            : "Our mission is to help you achieve your goals with modern and secure tools. Join hundreds of users who already trust us and transform the way you manage your work."}
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-secondary dark:bg-primary text-white text-center py-8 transition-colors">
        <p>
          {language === "ES"
            ? "© 2025 RHJobs. Todos los derechos reservados."
            : "© 2025 RHJobs. All rights reserved."}
        </p>
      </footer>
    </div>
  );
}
