'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntegrationApp } from '@integration-app/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; 

/* -------------------- schema -------------------- */
const schema = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().min(2, 'Company is required'),
  pronouns: z.string().max(30),
});
type FormVals = z.infer<typeof schema>;
/* ------------------------------------------------ */

export default function Home() {
  const integrationApp = useIntegrationApp();

  const [connector, setConnector] = useState<'hubspot' | 'pipedrive' | null>(
    null
  );
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>(
    'idle'
  );
  const [running, setRunning] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,  
    formState: { errors },
  } = useForm<FormVals>({ resolver: zodResolver(schema) });

  /* ------------ 1. Connect CRM ------------ */
  const connect = async (key: 'hubspot' | 'pipedrive') => {
    setConnector(key);
    setStatus('connecting');
    try {
      await integrationApp.integration(key).openNewConnection();
      setStatus('connected');
    } catch {
      setStatus('idle');
      setConnector(null);
    }
  };

  /* ------------ 2. Send flow --------------- */
  const onSubmit = async (data: FormVals) => {
    if (!connector || status !== 'connected') {
      return alert('Please connect a CRM first.');
    }
    setRunning(true);
    setLink(null);
    setRunId(null);

    try {
      const { output, runId } = await integrationApp
        .connection(connector)
        .flow('create-crm-contact')
        .run({ input: data });

      setLink(output?.contactUrl ?? null);
      setRunId(runId ?? null);
      reset();                         // 🧹 clear the form
    } catch (e: any) {
      alert(e.message ?? 'Flow failed');
    } finally {
      setRunning(false);
    }
  };

  /* ------------ helpers --------------- */
  const Spinner = (
    <ArrowPathIcon className="h-4 w-4 animate-spin inline-block mr-2" />
  );

  const sendLabel =
    running
      ? 'Sending…'
      : `Send to ${connector === 'hubspot' ? 'HubSpot' : 'Pipedrive'}`;

  /* ------------ UI --------------- */
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        {/* STEP 1 – Connect */}
        {status !== 'connected' ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800">
              Connect your CRM
            </h2>

            <button
              onClick={() => connect('hubspot')}
              disabled={status === 'connecting'}
              className="w-full flex justify-center items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition"
            >
              {status === 'connecting' && connector === 'hubspot' && Spinner}
              Connect HubSpot
            </button>

            <button
              onClick={() => connect('pipedrive')}
              disabled={status === 'connecting'}
              className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
            >
              {status === 'connecting' && connector === 'pipedrive' && Spinner}
              Connect Pipedrive
            </button>
          </>
        ) : (
          /* STEP 2 – Form */
          <>
            <p className="text-emerald-700 font-medium">
              Connected to {connector}. Enter contact details:
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-sm"
            >
              <div>
                <input
                  className="input"
                  placeholder="Full name*"
                  {...register('name')}
                />
                <p className="error">{errors.name?.message}</p>
              </div>

              <div>
                <input
                  className="input"
                  placeholder="Email*"
                  {...register('email')}
                />
                <p className="error">{errors.email?.message}</p>
              </div>

              <input
                className="input"
                placeholder="Phone"
                {...register('phone')}
              />

              <div>
                <input
                  className="input"
                  placeholder="Company*"
                  {...register('company')}
                />
                <p className="error">{errors.company?.message}</p>
              </div>

              <input
                className="input"
                placeholder="Pronouns"
                {...register('pronouns')}
              />

              <button
                type="submit"
                disabled={running}
                className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2 rounded-lg transition"
              >
                {running && Spinner}
                {sendLabel}
              </button>
            </form>
          </>
        )}

        {/* STEP 3 – Result */}
        {(runId || link) && (
          <div className="bg-gray-100 p-4 rounded-lg space-y-2 text-sm">
            {runId && (
              <p>
                <span className="font-medium">Run ID:</span> {runId}
              </p>
            )}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline"
              >
                View contact ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* Tailwind “input” & “error” shorthand */}
      <style jsx>{`
        .input {
          @apply w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 transition;
        }
        .error {
          @apply text-red-600 mt-1;
        }
      `}</style>
    </main>
  );
}
