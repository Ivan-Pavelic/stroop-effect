import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export function Button({ 
  className = "", 
  variant = 'default', 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}