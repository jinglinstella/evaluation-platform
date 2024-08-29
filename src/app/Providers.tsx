// The AuthProvider component is designed to wrap other components, providing them with access to authentication session data
"use client"
import { SessionProvider } from "next-auth/react";
import { ReactNode } from 'react';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
};