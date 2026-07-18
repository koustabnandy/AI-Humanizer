// src/components/ui/button.tsx
import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
    const variants = {
      default: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-md",
      outline: "border border-slate-800 bg-slate-900 text-slate-300 hover:text-white",
      ghost: "text-slate-400 hover:text-rose-400"
    };
    return (
      <button ref={ref} className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
    )
  }
)
Button.displayName = "Button"