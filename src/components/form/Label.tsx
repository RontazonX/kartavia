import React from 'react'

export default function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300 ${className || ''}`} {...props}>
      {children}
    </label>
  )
}
