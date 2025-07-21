"use client"

import { useSession } from "next-auth/react";
import React from "react"
import LoadingScreen from "./loading-screen";
import NotAuthenticate from "./not-authenticate";

export const ProtectedComponent = ({children}: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();

    if (status === "loading") return <LoadingScreen />

    if (!session) return <NotAuthenticate />

    return children;
}