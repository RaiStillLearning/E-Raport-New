// context/UserContext.tsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

interface UserContextType {
  userRole: string;
  setUserRole: (role: string) => void;
  fetchUserRole: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  userRole: "guest",
  setUserRole: () => {},
  fetchUserRole: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<string>("guest");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserRole("guest");
        return;
      }

      const response = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data?.role) {
        setUserRole(response.data.role);
        localStorage.setItem("role", response.data.role);
      } else {
        setUserRole("guest");
      }
    } catch (error) {
      console.error("Gagal fetch user role:", error);
      setUserRole("guest");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  return (
    <UserContext.Provider value={{ userRole, setUserRole, fetchUserRole }}>
      {!isLoading ? children : <div>Loading...</div>}
    </UserContext.Provider>
  );
};
