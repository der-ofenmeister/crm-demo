'use client';

import { IntegrationAppProvider } from '@integration-app/react';

export function IntegrationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <IntegrationAppProvider
      workspaceId={process.env.NEXT_PUBLIC_INT_APP_WORKSPACE_ID!}
    >
      {children}
    </IntegrationAppProvider>
  );
}
