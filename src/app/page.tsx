"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIntegrationApp } from "@integration-app/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

/* --- validation schema --- */
const schema = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().min(2, "Company is required"),
    pronouns: z.string().max(30).optional(),
});
type FormVals = z.infer<typeof schema>;
/* ------------------------- */

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

    /* connect CRM */
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

    /* submit form */
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
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center py-20 px-4">
            {/* CONNECT STEP */}
            {!crm ? (
                <div className="w-full max-w-lg space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Connect your CRM</h1>
                        <p className="text-gray-600 text-lg">Choose your preferred CRM platform to get started</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => connect("hubspot")}
                            disabled={connecting}
                            className="w-full py-5 px-8 rounded-2xl flex justify-center items-center
                           font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 
                           hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 
                           disabled:cursor-not-allowed transition-all duration-300
                           transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl
                           border-2 border-orange-400 hover:border-orange-500"
                        >
                            {connecting && <ArrowPathIcon className="h-6 w-6 animate-spin mr-3 shrink-0" />}
                            <span className="text-lg">🧡 Connect HubSpot</span>
                        </button>

                        <button
                            onClick={() => connect("pipedrive")}
                            disabled={connecting}
                            className="w-full py-5 px-8 rounded-2xl flex justify-center items-center
                           font-bold text-white bg-gradient-to-r from-green-500 to-green-600 
                           hover:from-green-600 hover:to-green-700 disabled:opacity-60 
                           disabled:cursor-not-allowed transition-all duration-300
                           transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl
                           border-2 border-green-400 hover:border-green-500"
                        >
                            {connecting && <ArrowPathIcon className="h-6 w-6 animate-spin mr-3 shrink-0" />}
                            <span className="text-lg">💚 Connect Pipedrive</span>
                        </button>
                    </div>
                </div>
            ) : (
                /* FORM STEP */
                <div className="w-full max-w-lg space-y-8">
                    <div className="text-center">
                        <div className={`inline-flex items-center px-6 py-3 rounded-full font-bold text-white shadow-lg ${
                            crm === "hubspot" 
                                ? "bg-gradient-to-r from-orange-500 to-orange-600" 
                                : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}>
                            <span className="text-2xl mr-2">✓</span>
                            Connected to {crm === "hubspot" ? "HubSpot" : "Pipedrive"}
                        </div>
                        <p className="mt-6 text-gray-700 text-lg font-medium">Enter contact details below:</p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white rounded-3xl shadow-2xl p-10 space-y-8 border border-gray-200 backdrop-blur-sm"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(249,250,251,0.9) 100%)'
                        }}
                    >
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-3">
                                    Full Name *
                                </label>
                                <input
                                    {...register("name")}
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-6 py-4
                               focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none
                               transition-all duration-300 text-lg font-medium placeholder-gray-400"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-3 flex items-center font-medium">
                                        <span className="mr-2 text-lg">⚠</span>
                                        {errors.name?.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-3">
                                    Email Address *
                                </label>
                                <input
                                    {...register("email")}
                                    placeholder="Enter your email address"
                                    type="email"
                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-6 py-4
                               focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none
                               transition-all duration-300 text-lg font-medium placeholder-gray-400"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-3 flex items-center font-medium">
                                        <span className="mr-2 text-lg">⚠</span>
                                        {errors.email?.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-3">
                                    Phone Number
                                </label>
                                <input
                                    {...register("phone")}
                                    placeholder="Enter your phone number (optional)"
                                    type="tel"
                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-6 py-4
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none
                             transition-all duration-300 text-lg font-medium placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-3">
                                    Company *
                                </label>
                                <input
                                    {...register("company")}
                                    placeholder="Enter your company name"
                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-6 py-4
                               focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none
                               transition-all duration-300 text-lg font-medium placeholder-gray-400"
                                />
                                {errors.company && (
                                    <p className="text-red-500 text-sm mt-3 flex items-center font-medium">
                                        <span className="mr-2 text-lg">⚠</span>
                                        {errors.company?.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-3">
                                    Pronouns
                                </label>
                                <input
                                    {...register("pronouns")}
                                    placeholder="e.g., they/them, she/her, he/him (optional)"
                                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-6 py-4
                             focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none
                             transition-all duration-300 text-lg font-medium placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            className={`w-full py-5 px-8 rounded-2xl flex justify-center items-center
                         font-bold text-white text-lg disabled:opacity-60 disabled:cursor-not-allowed 
                         transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] 
                         shadow-xl hover:shadow-2xl mt-10 border-2 ${
                             crm === "hubspot"
                                 ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-orange-400 hover:border-orange-500"
                                 : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-green-400 hover:border-green-500"
                         }`}
                        >
                            {sending && <ArrowPathIcon className="h-6 w-6 animate-spin mr-3 shrink-0" />}
                            <span>
                                {sending
                                    ? "Sending to CRM..."
                                    : `Send to ${crm === "hubspot" ? "HubSpot" : "Pipedrive"}`}
                            </span>
                        </button>
                    </form>
                </div>
            )}

            {/* RESULT PANEL */}
            {runJson && (
                <div className="w-full max-w-lg mt-10">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-8 rounded-3xl shadow-2xl">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                <span className="text-white font-bold text-xl">✓</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-green-800 text-xl">Contact Created Successfully!</h3>
                                <p className="text-green-600 font-medium">
                                    Run ID: {runJson.runId || runJson.id}
                                </p>
                            </div>
                        </div>
                        <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-bold text-base mb-3 hover:underline">
                                📋 View technical details
                            </summary>
                            <pre className="mt-4 p-6 bg-gray-900 text-green-400 rounded-2xl overflow-x-auto text-xs font-mono shadow-inner">
                                {JSON.stringify(runJson, null, 2)}
                            </pre>
                        </details>
                    </div>
                </div>
            )}
        </main>
    );
}