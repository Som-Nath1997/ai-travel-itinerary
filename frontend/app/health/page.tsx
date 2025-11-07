"use client";

import { useEffect, useState } from "react";

export default function HealthPage() {
  const [status, setStatus] = useState<{
    frontend: string;
    backend: string | null;
    loading: boolean;
  }>({
    frontend: "ok",
    backend: null,
    loading: true,
  });

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/v1/health`);
        const data = await response.json();
        setStatus({
          frontend: "ok",
          backend: data.status || "error",
          loading: false,
        });
      } catch (error) {
        setStatus({
          frontend: "ok",
          backend: "error",
          loading: false,
        });
      }
    };

    checkBackendHealth();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Health Check</h1>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <p className="text-lg">
              <strong>Frontend Status:</strong>{" "}
              <span className={status.frontend === "ok" ? "text-green-600" : "text-red-600"}>
                {status.frontend.toUpperCase()}
              </span>
            </p>
          </div>
          <div className="p-4 border rounded">
            <p className="text-lg">
              <strong>Backend Status:</strong>{" "}
              {status.loading ? (
                <span className="text-gray-600">Loading...</span>
              ) : (
                <span className={status.backend === "ok" ? "text-green-600" : "text-red-600"}>
                  {status.backend?.toUpperCase() || "ERROR"}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

