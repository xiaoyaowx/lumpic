import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 40 }: LogoProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-current"
      >
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
      <span className="ml-2 font-semibold text-xl">Lumière</span>
    </div>
  );
}
