"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders `fallback` until the box comes within `rootMargin` of the viewport,
 * then mounts `children` (pair with next/dynamic so their code downloads only
 * then). Once mounted it stays mounted.
 */
export function LoadOnView({
  children,
  fallback = null,
  rootMargin = "600px",
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    if (!("IntersectionObserver" in window)) return setShow(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, show]);

  return (
    <div ref={ref} className={className}>
      {show ? children : fallback}
    </div>
  );
}
