"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIntegrationApp } from "@integration-app/react";
import { IntegrationAppClient } from '@integration-app/sdk'

// ------------- zod guard for the form -------------
const schema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().min(2),
    pronouns: z.string().max(30),
});
type FormVals = z.infer<typeof schema>;
// --------------------------------------------------

export default function Home() {
    const integrationApp = useIntegrationApp(); 
    const [connector, setConnector] = useState<"hubspot" | "pipedrive" | null>(
        null
    );
    const [status, setStatus] = useState<"idle" | "connecting" | "connected">(
        "idle"
    );
    const [running, setRunning] = useState(false);
    const [link, setLink] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormVals>({ resolver: zodResolver(schema) });

    // -------- 1. Connect buttons --------
    const connect = async (key: "hubspot" | "pipedrive") => {
        setConnector(key);
        setStatus("connecting");
        try {
            await integrationApp.integration(key).openNewConnection();
            setStatus("connected");
        } catch (e) {
            alert("Connection cancelled");
            setStatus("idle");
            setConnector(null);
        }
    };

    // -------- 2. Run flow on submit -------
    const onSubmit = async (data: FormVals) => {
        if (!connector || status !== "connected")
            return alert("Please connect a CRM first");
        setRunning(true);
        setLink(null);
        try {
            const result = await integrationApp
                .connection(connector)
                .flow("create-crm-contact")
                .run({ input: data });

            // assume the flow returns {contactUrl}
            setLink(result.output?.contactUrl ?? null);
        } catch (e: any) {
            alert(e.message ?? "Flow failed");
        } finally {
            setRunning(false);
        }
    };

    return (
        <main className="max-w-md mx-auto p-6 space-y-6">
            {/* step 1 – connect */}
            {!connector || status !== "connected" ? (
                <>
                    <h2 className="text-lg font-semibold">Connect your CRM</h2>
                    <button
                        onClick={() => connect("hubspot")}
                        className="bg-orange-600 text-white px-4 py-2 rounded mr-2"
                        disabled={status === "connecting"}
                    >
                        {status === "connecting" && connector === "hubspot"
                            ? "Connecting…"
                            : "Connect HubSpot"}
                    </button>
                    <button
                        onClick={() => connect("pipedrive")}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        disabled={status === "connecting"}
                    >
                        {status === "connecting" && connector === "pipedrive"
                            ? "Connecting…"
                            : "Connect Pipedrive"}
                    </button>
                </>
            ) : (
                <>
                    <p className="text-emerald-700">
                        Connected to {connector}. Fill the form:
                    </p>

                    {/* step 2 – form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        <input placeholder="Full name" {...register("name")} />
                        <p className="text-red-600 text-sm">
                            {errors.name?.message}
                        </p>

                        <input placeholder="Email" {...register("email")} />
                        <p className="text-red-600 text-sm">
                            {errors.email?.message}
                        </p>

                        <input placeholder="Phone" {...register("phone")} />

                        <input placeholder="Company" {...register("company")} />
                        <p className="text-red-600 text-sm">
                            {errors.company?.message}
                        </p>

                        <input
                            placeholder="Pronouns"
                            {...register("pronouns")}
                        />

                        <button
                            type="submit"
                            disabled={running}
                            className="w-full bg-blue-600 text-white py-2 rounded"
                        >
                            {running ? "Creating…" : "Create Contact"}
                        </button>
                    </form>
                </>
            )}

            {/* step 3 – result */}
            {link && (
                <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center text-emerald-700 underline"
                >
                    View contact in CRM ↗
                </a>
            )}
        </main>
    );
}
