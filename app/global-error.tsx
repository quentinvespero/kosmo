'use client'

import { useEffect } from "react"

// Root layout is unavailable here — must include own <html>/<body> and be self-contained
export default function GlobalError({ error: _error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => { console.error(_error) }, [_error])
    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: "sans-serif" }}>
                <div style={{
                    display: "flex",
                    minHeight: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                }}>
                    <div style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.75rem",
                        padding: "1.5rem",
                        maxWidth: "28rem",
                        width: "100%",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}>
                        <h2 style={{ margin: "0 0 0.5rem", fontWeight: 600 }}>
                            Unexpected error
                        </h2>
                        <p style={{ margin: "0 0 1.5rem", color: "#6b7280", fontSize: "0.875rem" }}>
                            Kosmo is having trouble right now.
                        </p>
                        <button
                            onClick={reset}
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "0.375rem",
                                padding: "0.5rem 1rem",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                            }}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
