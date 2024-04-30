import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext(null); // Provide a default value for the context

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Retrieve the user info from localStorage if it exists
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData)); // Save to localStorage on login
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user'); // Clear localStorage on logout
        setUser(null);
    };

    const updateUser = (newUserData) => {
        localStorage.setItem('user', JSON.stringify(newUserData)); // Update user data in localStorage
        setUser(newUserData); // Update user data in state
    };

    // Handle browser refresh by checking if the user data is in localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
