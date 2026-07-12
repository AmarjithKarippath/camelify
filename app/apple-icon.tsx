import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#A8E0BC",
          borderRadius: 40,
          border: "4px solid #0E1B2C",
        }}
      >
        <svg width="110" height="110" viewBox="0 0 44 44" fill="none">
          <path
            d="M12 28V16.5C12 14.567 13.567 13 15.5 13C17.433 13 19 14.567 19 16.5V28"
            stroke="#0E1B2C"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M22 28V16.5C22 14.567 23.567 13 25.5 13C27.2 13 28.6 14.2 29 15.8"
            stroke="#3FBF6F"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M29 15.8C30.5 14.8 32.5 15.2 33.5 16.7C34.5 18.2 34.1 20.2 32.6 21.2L29 23.5V28"
            stroke="#3FBF6F"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
