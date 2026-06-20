import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const Button = ({ variant = "primary", children, className = "", ...props }: ButtonProps) => {
  if (variant === "secondary") {
    return (
      <button
        className={`text-foreground hover:text-accent transition-colors duration-200 font-medium ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`bg-accent text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
