import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generates initials from a display name (e.g. "John Doe" → "JD")
export const getInitials = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return ''
    const parts = trimmed.split(/\s+/)
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const formatDate = (date: Date) =>
    date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
