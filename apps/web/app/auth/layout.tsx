"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/dashboard/home");
        }
    }, [session, router]);

    if (session) {
        return null;
    }

    return <>{children}</>;
}
