import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    // Security headers applied to every response.
    // CSP is intentionally left out for now — it needs per-route testing to avoid
    // breaking inline styles/scripts, and is tracked as a follow-up.
    headers: async () => [
        {
            source: "/:path*",
            headers: [
                // Force HTTPS (2 years, incl. subdomains) — mitigates SSL stripping
                { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
                // Disallow framing the app → clickjacking protection
                { key: "X-Frame-Options", value: "DENY" },
                // Prevent MIME-type sniffing
                { key: "X-Content-Type-Options", value: "nosniff" },
                // Limit referrer leakage on cross-origin navigation
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                // Disable powerful browser features the app doesn't use
                { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
            ],
        },
    ],
}

export default nextConfig
