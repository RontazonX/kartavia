import React from 'react'

export default function InputField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500 ${props.className || ''}`}
    />
  )
}
