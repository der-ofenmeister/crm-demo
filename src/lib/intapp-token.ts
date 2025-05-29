import jwt from "jsonwebtoken";

const WORKSPACE_KEY = process.env.INT_APP_WORKSPACE_KEY!;
const SECRET_KEY = process.env.INT_APP_WORKSPACE_SECRET!;

/**
 * Create a short-lived Integration.app user token.
 */
export function makeIntegrationToken({
    userId,
    userName,
}: {
    userId: string;
    userName: string;
}): string {
    const payload = {
        id: userId,
        name: userName,
        // optional custom fields you want to see in Integration.app logs
        fields: { role: "intapp-crm-demo" },
    };

    const opts: jwt.SignOptions = {
        issuer: WORKSPACE_KEY,
        // 2 h is plenty for a demo
        expiresIn: 60 * 60 * 2,
        algorithm: "ES256", // match your key type (ES256, RS256, …)
    };

    return jwt.sign(payload, SECRET_KEY, opts);
}
