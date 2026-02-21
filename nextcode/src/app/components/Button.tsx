"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
  as?: "button" | "a";
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-maroon)] text-white hover:bg-[var(--color-maroon-dark)]",
  secondary: "bg-[var(--color-primary-green)] text-white hover:bg-[var(--color-primary-green-dark)]",
  outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-[var(--color-primary-green)]",
  ghost: "bg-transparent text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className = "",
  as = "button",
  href,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-full cursor-pointer transition-all duration-200 ease-out hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed font-[var(--font-body)]";

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`.trim();

  if (as === "a" && href) {
    return (
      <a href={href} className={combinedStyles}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
}



