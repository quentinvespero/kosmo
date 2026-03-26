'use client'

import { useEffect, useRef } from "react"

type UseKeyboardShortcutOptions = {
    // Set to false to disable without unmounting the component.
    // Useful for conditional shortcuts (e.g. own-profile-only).
    // Defaults to true.
    enabled?: boolean
}

const useKeyboardShortcut = (
    key: string,
    callback: () => void,
    options: UseKeyboardShortcutOptions = {}
) => {
    const { enabled = true } = options

    // Keep callbackRef in sync so the handler always calls the latest version
    // without needing to re-register the listener on every render
    const callbackRef = useRef(callback)
    useEffect(() => {
        callbackRef.current = callback
    })

    useEffect(() => {
        if (!enabled) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== key) return
            const target = e.target as HTMLElement
            // Ignore shortcuts while the user is typing in an input field
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) return
            e.preventDefault()
            callbackRef.current()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, enabled]) // callback intentionally omitted — callbackRef stays current without re-registering
}

export { useKeyboardShortcut }
