"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import {useRouter} from "next/navigation";

type User = {
    id: number;
    username: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    refetchUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
    refetchUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const res = await axios.get("/api/auth/me", { withCredentials: true });
            setUser(res.data.user);
        } catch (err) {
            const error = err as AxiosError;

            if (error.response?.status === 401) {
                try {
                    const refreshRes = await axios.post("/api/auth/refresh", null, {
                        withCredentials: true,
                    });

                    if (refreshRes.status === 200) {
                        const retryRes = await axios.get("/api/auth/me", {
                            withCredentials: true,
                        });
                        setUser(retryRes.data.user);
                        return;
                    }
                } catch (refreshErr) {
                    setUser(null);
                    router.replace("/login");
                }
            }

            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                refetchUser: fetchUser,
            }}
        >

            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
