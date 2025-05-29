// server component by default, so we can use makeIntegrationToken
import "./globals.css";
import "@integration-app/react/styles.css";
import type { Metadata } from "next";
import { makeIntegrationToken } from "@/lib/intapp-token";
import { IntegrationWrapper } from "@/components/IntegrationWrapper";

export const metadata: Metadata = { title: "CRM Integration Demo" };

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 👇 runs on the server only
    const token = makeIntegrationToken({
        // real-world: pull from auth/session cookie
        userId: "demo-user-" + Date.now().toString(36),
        userName: "Rohan (demo)",
    });

    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen flex items-center justify-center">
                <IntegrationWrapper token={token}>
                    {children}
                </IntegrationWrapper>
            </body>
        </html>
    );
}
