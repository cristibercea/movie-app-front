import React, { useCallback, useEffect, useState } from 'react';
import { getLogger } from '../core';
import { login as loginApi } from './authApi';

const log = getLogger('AuthProvider');

type LoginFn = (username?: string, password?: string) => void;

export interface AuthState {
    authenticationError: Error | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    isCheckingAuth: boolean;
    login?: LoginFn;
    logout?: () => void;
    pendingAuthentication?: boolean;
    username?: string;
    password?: string;
    token: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isAuthenticating: false,
    isCheckingAuth: true,
    authenticationError: null,
    pendingAuthentication: false,
    token: '',
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>(initialState);
    const { isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token, isCheckingAuth } = state;

    const login = useCallback<LoginFn>(loginCallback, []);
    useEffect(checkStoredToken, []); // verifică tokenul o singură dată la startup
    useEffect(authenticationEffect, [pendingAuthentication]);

    const value = { isAuthenticated, login, logout, isAuthenticating, authenticationError, token, isCheckingAuth };

    log('render', state);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

    // ✅ Verifică tokenul salvat în localStorage la pornire
    function checkStoredToken() {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            log('Token found in localStorage');
            setState((prev) => ({
                ...prev,
                token: storedToken,
                isAuthenticated: true,
                isCheckingAuth: false,
            }));
        } else {
            log('No token found');
            setState((prev) => ({
                ...prev,
                isCheckingAuth: false,
            }));
        }
    }

    function loginCallback(username?: string, password?: string): void {
        log('login');
        setState((prev) => ({
            ...prev,
            pendingAuthentication: true,
            username,
            password,
        }));
    }

    function authenticationEffect() {
        let canceled = false;
        if (!pendingAuthentication) {
            return;
        }

        authenticate();
        return () => {
            canceled = true;
        };

        async function authenticate() {
            try {
                log('Authenticating...');
                setState((prev) => ({
                    ...prev,
                    isAuthenticating: true,
                    authenticationError: null,
                }));
                const { username, password } = state;
                const { token } = await loginApi(username, password);
                if (canceled) return;
                log('Authentication succeeded');
                localStorage.setItem('authToken', token);
                setState((prev) => ({
                    ...prev,
                    token,
                    pendingAuthentication: false,
                    isAuthenticated: true,
                    isAuthenticating: false,
                    isCheckingAuth: false,
                }));
            } catch (error) {
                if (canceled) return;
                log('Authentication failed');
                setState((prev) => ({
                    ...prev,
                    authenticationError: error as Error,
                    pendingAuthentication: false,
                    isAuthenticating: false,
                    isCheckingAuth: false,
                }));
            }
        }
    }

    function logout() {
        log('logout');
        localStorage.removeItem('authToken');
        setState((prev) => ({
            ...prev,
            token: '',
            isAuthenticated: false,
            isCheckingAuth: false,
        }));
    }
};
