"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIntegrationApp } from "@integration-app/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

/* ---------- validation schema ---------- */
const schema = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().min(2, "Company is required"),
    pronouns: z.string().max(30).optional(),
});
type FormVals = z.infer<typeof schema>;
/* --------------------------------------- */

export default function Home() {
    const intApp = useIntegrationApp();

    const [crm, setCrm] = useState<"hubspot" | "pipedrive" | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [sending, setSending] = useState(false);
    const [runJson, setRunJson] = useState<any | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormVals>({ resolver: zodResolver(schema) });

    /* ----- Connect CRM ----- */
    const connect = async (key: "hubspot" | "pipedrive") => {
        setConnecting(true);
        setCrm(key);
        try {
            await intApp.integration(key).openNewConnection();
        } catch {
            setCrm(null);
        } finally {
            setConnecting(false);
        }
    };

    /* ----- Submit form ----- */
    const onSubmit = async (data: FormVals) => {
        if (!crm) return alert("Connect a CRM first");
        setSending(true);
        setRunJson(null);
        try {
            const res = await intApp
                .connection(crm)
                .flow("create-crm-contact")
                .run({
                    input: data,
                });
            setRunJson(res);
            reset();
        } catch (e: any) {
            alert(e.message ?? "Error");
        } finally {
            setSending(false);
        }
    };

    const Spinner = (
        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2 shrink-0" />
    );

    return (
        <main className="min-h-screen flex flex-col items-center py-20 px-4">
            {/* ---------- CONNECT STEP ---------- */}
            {!crm ? (
                <div className="w-full max-w-lg space-y-6 text-center">
                    <h1 className="text-2xl font-semibold">Connect your CRM</h1>

                    <button
                        onClick={() => connect("hubspot")}
                        disabled={connecting}
                        className="w-full py-3 rounded flex justify-center items-center
                       font-medium text-white bg-orange-600 hover:bg-orange-700
                       disabled:opacity-60 transition"
                    >
                        {connecting && Spinner}Connect HubSpot
                    </button>

                    <button
                        onClick={() => connect("pipedrive")}
                        disabled={connecting}
                        className="w-full py-3 rounded flex justify-center items-center
                       font-medium text-white bg-green-600 hover:bg-green-700
                       disabled:opacity-60 transition"
                    >
                        {connecting && Spinner}Connect Pipedrive
                    </button>
                </div>
            ) : (
                /* ---------- FORM STEP ---------- */
                <div className="w-full max-w-lg space-y-6">
                    <p className="text-emerald-700">
                        Connected to {crm}. Enter contact details:
                    </p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-gray-50 rounded-xl shadow p-6 space-y-5"
                    >
                        <div>
                            <input
                                {...register("name")}
                                placeholder="Full name*"
                                className="input"
                            />
                            <p className="error">{errors.name?.message}</p>
                        </div>

                        <div>
                            <input
                                {...register("email")}
                                placeholder="Email*"
                                className="input"
                            />
                            <p className="error">{errors.email?.message}</p>
                        </div>

                        <input
                            {...register("phone")}
                            placeholder="Phone"
                            className="input"
                        />

                        <div>
                            <input
                                {...register("company")}
                                placeholder="Company*"
                                className="input"
                            />
                            <p className="error">{errors.company?.message}</p>
                        </div>

                        <input
                            {...register("pronouns")}
                            placeholder="Pronouns"
                            className="input"
                        />

                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full py-3 rounded flex justify-center items-center
                         font-medium text-white bg-blue-600 hover:bg-blue-700
                         disabled:opacity-60 transition"
                        >
                            {sending && Spinner}
                            {sending
                                ? "Sending…"
                                : `Send to ${
                                      crm === "hubspot"
                                          ? "HubSpot"
                                          : "Pipedrive"
                                  }`}
                        </button>
                    </form>
                </div>
            )}

            {/* ---------- RESULT PANEL ---------- */}
            {runJson && (
                <div className="w-full max-w-lg mt-10">
                    <div className="bg-gray-100 p-4 rounded-xl text-sm shadow-inner">
                        <p className="mb-2 font-medium">
                            Job queued — runId: {runJson.runId || runJson.id}
                        </p>
                        <details className="whitespace-pre-wrap break-all">
                            <summary className="cursor-pointer text-blue-700">
                                View raw response
                            </summary>
                            {JSON.stringify(runJson, null, 2)}
                        </details>
                    </div>
                </div>
            )}
        </main>
    );
}
