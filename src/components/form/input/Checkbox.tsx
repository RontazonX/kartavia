import React from 'react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export default function Checkbox({ checked, onChange, className }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={`rounded border-gray-300 text-brand-500 focus:ring-brand-500 ${className || ''}`}
    />
  )
}
