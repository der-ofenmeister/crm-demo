"use client";

import { IntegrationAppProvider } from "@integration-app/react";

export function IntegrationWrapper({
    children,
    token,
}: {
    children: React.ReactNode;
    token: string;
}) {
    return (
        <IntegrationAppProvider token={token}>
            {children}
        </IntegrationAppProvider>
    );
}
