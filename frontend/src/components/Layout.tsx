import { Navbar } from "../components/Navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="pt-16">{children}</div> {/* margen para el navbar fijo */}
    </div>
  );
}
