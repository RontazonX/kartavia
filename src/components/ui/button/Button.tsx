import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ children, size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center rounded-lg bg-brand-500 font-medium text-white transition hover:bg-brand-600 disabled:bg-brand-300 ${
        size === 'sm' ? 'px-4 py-3 text-sm' : 'px-6 py-4 text-base'
      } ${className || ''}`}
    >
      {children}
    </button>
  )
}
