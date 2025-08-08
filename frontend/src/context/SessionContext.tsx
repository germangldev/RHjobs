import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";


interface SessionContextType {
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
}

const SessionContext = createContext<SessionContextType>({
  token: null,
  role: null,
  setToken: () => {},
});

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      const decoded: any = jwtDecode(newToken);
      setRole(decoded.roles?.[0] || null); // tomamos el primer rol
    } else {
      setRole(null);
    }
  };

  return (
    <SessionContext.Provider value={{ token, role, setToken }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
