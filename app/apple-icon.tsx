import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1b3a 0%, #2a2344 100%)",
          borderRadius: 36,
        }}
      >
        <svg width="140" height="140" viewBox="0 0 512 512">
          <defs>
            <linearGradient id="stripe" x1="80" y1="100" x2="432" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <rect x="96" y="110" width="320" height="56" rx="8" fill="white" />
          <rect x="204" y="110" width="104" height="296" rx="8" fill="white" />
          <line x1="72" y1="80" x2="440" y2="300" stroke="url(#stripe)" strokeWidth="36" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
