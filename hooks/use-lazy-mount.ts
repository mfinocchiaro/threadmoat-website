"use client"

import { useRef, useState, useEffect } from "react"

/**
 * Hook that uses IntersectionObserver to detect when a container enters the viewport.
 * Returns { ref, hasBeenVisible } — mount expensive children only when hasBeenVisible is true.
 *
 * @param rootMargin - How far before the element is visible to trigger (default: '200px').
 *   Positive values mean "start loading before it's visible" to avoid jarring pop-in.
 */
export function useLazyMount(rootMargin: string = "200px") {
  const ref = useRef<HTMLDivElement>(null)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasBeenVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, hasBeenVisible])

  return { ref, hasBeenVisible }
}
