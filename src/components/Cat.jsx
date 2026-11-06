import React from "react";

export default function Cat({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 40V12l15 12h10l15-12v28c0 12-40 12-40 0Z"
        fill="currentColor"
      />

      <path
        d="m21 35 5 2m12 0 5-2m-15 7 4 3 4-3"
        stroke="var(--cat-lines, #f7f3e9)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M6 35h10M5 42l11-2m32-5h10m-10 5 11 2"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
