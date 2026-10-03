import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null); //what are createContext and useContext? and how is the flow working? and why are initializing first and not declaring directly?

export const AuthProvider = ({ children }) => { // i didn't understand the auth provider and auth channel, and also why is children written in {} and do i have to write only children or can i rename it to any word?
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkCurrentUser = async () => {
            try {
                const response = await api.get("/users/current-user");
                setUser(response.data?.data || null); //what does this response print? and why write data 2 times?
            } catch (error) {
                setUser(null); //give me 2 cases when i will get no response and when i will recieve the error
            } finally {
                setLoading(false);
            }
        };

        checkCurrentUser();
    },[]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post("/users/logout");
        } catch (error) {
            console.error("Logout error", error)
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value = {{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => { // i didn't understand use of this?
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}